import { createApp, close } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { basename } from '@waiting/shared-core'
import { Application, Context } from 'egg'

import { TraceMiddleware } from '../../src/app/middleware/tracer'


const filename = basename(__filename)

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })

  it('should works', async () => {
    const ctx: Context = app.createAnonymousContext()
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)
    const span = ctx.tracerManager.currentSpan()
    expect(span).toBeTruthy()
  })

  it('should works with parent span', async () => {
    const traceHeaderKey = 'uber-trace-id'
    const ctx: Context = app.createAnonymousContext()
    const parentSpanId = '123'
    ctx.request.headers[traceHeaderKey] = `${parentSpanId}:${parentSpanId}:0:1`
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)
    const spanHeader = ctx.tracerManager.headerOfCurrentSpan()[traceHeaderKey]
    const expectParentSpanId = spanHeader?.substring(0, spanHeader.indexOf(':'))
    expect(expectParentSpanId).toEqual(parentSpanId)
  })

  it('should not works if path is in whitelist', async () => {
    const ctx: Context = app.createAnonymousContext()
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    ctx.path = '/untracedPath'
    // @ts-expect-error
    await mw(ctx, next)
    expect(ctx.tracerManager.isTraceEnabled).toEqual(false)
  })
})


async function next(): Promise<void> {
  return void 0
}

