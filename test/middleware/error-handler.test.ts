import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';

import { ErrorHandlerMiddleware } from '../../src/app/middleware/error-handler';
import MyError from '../../src/app/util/my-error';
import { Context } from '../../src/interface'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  it('should 404 works', async () => {
    const { app, next } = testConfig
    const ctx = app.createAnonymousContext() as Context<any>

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
    const { app } = testConfig
    const ctx = app.createAnonymousContext() as Context<any>

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
    const { app } = testConfig
    const ctx = app.createAnonymousContext() as Context<any>

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



async function nextThrowError(): Promise<void> {
  throw new MyError('ValidationError')
}

async function nextThrowError500(): Promise<void> {
  throw new MyError('Server Error', 500)
}
