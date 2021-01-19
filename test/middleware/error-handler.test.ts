/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createApp, close } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { Application } from 'egg'
import * as assert from 'power-assert';

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
    assert(status === 404)
    assert(body.message === 'Not Found')
  })

  it('should 422 works', async () => {
    const ctx = app.createAnonymousContext()
    ctx.status = 200
    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, nextThrowError)

    const { status, body } = ctx
    assert(status === 422, status.toString())
    assert(body.message === 'ValidationError')
  })

  it('should parseRequestId() works', async () => {
    const key = 'x-request-id'
    const ctx = app.createAnonymousContext()
    ctx.status = 200

    const input = Math.random().toString()
    assert(input.length)
    // ctx.set(key, input) not works
    ctx.request.headers[key] = input

    const inst = await ctx.requestContext.getAsync(ErrorHandlerMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const { status } = ctx
    assert(status === 200)

    const xReqId = ctx.response.get(key)
    assert(xReqId === input)
  })

})


async function next(): Promise<void> {
  return void 0
}

async function nextThrowError(): Promise<void> {
  throw new MyError('ValidationError')
}

