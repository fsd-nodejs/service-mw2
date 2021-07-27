/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createApp, close } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import * as assert from 'power-assert';

import { Application } from '../../src/interface';
import { ErrorHandlerMiddleware } from '../../src/app/middleware/error-handler'
import MyError from '../../src/app/util/my-error'


const filename = 'err-handler.middleware.ts'

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })


  it('should 404 works', async () => {
    const ctx = app.createAnonymousContext()
    ctx.status = 404
    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const { body, status } = ctx
    assert.ok(status === 404)
    assert.ok(body.message === 'Not Found')
  })

  it('should 422 works', async () => {
    const ctx = app.createAnonymousContext()
    ctx.status = 200
    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, nextThrowError)

    const { status, body } = ctx
    assert.ok(status === 422, status.toString())
    assert.ok(body.message === 'ValidationError')
  })


  it('should 500 works', async () => {
    const ctx = app.createAnonymousContext()
    ctx.status = 200
    ctx.app.config.env = 'prod'
    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, nextThrowError500)
    const { body, status } = ctx
    assert.ok(status === 500)
    assert.ok(body.message === 'Internal Server Error')
  })
})


async function next(): Promise<void> {
  return void 0
}

async function nextThrowError(): Promise<void> {
  throw new MyError('ValidationError')
}

async function nextThrowError500(): Promise<void> {
  throw new MyError('Server Error', 500)
}
