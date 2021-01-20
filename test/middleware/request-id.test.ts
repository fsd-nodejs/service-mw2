/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createApp, close } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { Application } from 'egg'
import { retrieveFromId } from 'egg-koid'
import * as assert from 'power-assert';

import { RequestIdMiddleware } from '../../src/app/middleware/request-id'


const filename = 'request-id.middleware.ts'

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })

  it('should works', async () => {
    const key = 'x-request-id'
    const ctx = app.createAnonymousContext()
    ctx.status = 200
    const inst = await ctx.requestContext.getAsync(RequestIdMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const { status, reqId } = ctx
    assert(status === 200)
    assert(reqId && reqId.length)
    const info = retrieveFromId(reqId)
    assert(typeof info.dataCenter === 'number')
    assert(typeof info.worker === 'number')
    assert(typeof info.timestamp === 'number')

    const xReqId = ctx.response.get(key)
    assert(xReqId === reqId)
  })

  it('should works with existing x-request-id header', async () => {
    const key = 'x-request-id'
    const ctx = app.createAnonymousContext()
    ctx.status = 200

    const input = Math.random().toString()
    assert(input.length)
    // ctx.set(key, input) not works
    ctx.request.headers[key] = input

    const inst = await ctx.requestContext.getAsync(RequestIdMiddleware)
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

