import { createApp, close } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { basename } from '@waiting/shared-core'
import { Application, Context } from 'egg'

import { TraceMiddleware } from '../../src/app/middleware/tracer'
import { TraceHeaderKey } from '../../src/config/tracer.config'


const filename = basename(__filename)

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })

  it('Should work', async () => {
    const ctx: Context = app.createAnonymousContext()
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)
    const span = ctx.tracerManager.currentSpan()
    expect(span).toBeTruthy()
  })

  it('Should work with parent span', async () => {
    const ctx: Context = app.createAnonymousContext()
    const parentSpanId = '123'
    ctx.request.headers[TraceHeaderKey] = `${parentSpanId}:${parentSpanId}:0:1`
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)
    const spanHeader = ctx.tracerManager.headerOfCurrentSpan()[TraceHeaderKey]
    const expectParentSpanId = spanHeader?.slice(0, spanHeader.indexOf(':'))
    expect(expectParentSpanId).toEqual(parentSpanId)
  })

  it('Should work if path not match whitelist string', async () => {
    const ctx: Context = app.createAnonymousContext()
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    ctx.path = '/untracedPath'
    // @ts-expect-error
    await mw(ctx, next)
    expect(ctx.tracerManager.isTraceEnabled).toEqual(false)
  })

  it('Should work if path match whitelist regexp', async () => {
    const ctx: Context = app.createAnonymousContext()
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    ctx.path = '/unitTest' + Math.random().toString()
    // @ts-expect-error
    await mw(ctx, next)
    expect(ctx.tracerManager.isTraceEnabled).toEqual(false)
  })

  it('Should work if path not match whitelist regexp', async () => {
    const ctx: Context = app.createAnonymousContext()
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    ctx.path = '/unittest' + Math.random().toString()
    // @ts-expect-error
    await mw(ctx, next)
    expect(ctx.tracerManager.isTraceEnabled).toEqual(true)
  })
})


async function next(): Promise<void> {
  return void 0
}

