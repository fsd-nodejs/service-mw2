/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */

import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';
import { KoidComponent } from '@mw-components/koid'
import { HeadersKey } from '@mw-components/jaeger';

import { RequestIdMiddleware } from '../../src/app/middleware/request-id'
import { Context } from '../../src/interface'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  it('should works', async () => {
    const { app, next } = testConfig
    const ctx = app.createAnonymousContext() as Context<any>

    const key = HeadersKey.reqId
    ctx.status = 200
    const inst = await ctx.requestContext.getAsync(RequestIdMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const { status, reqId } = ctx
    assert.ok(status === 200)
    assert.ok(reqId && reqId.length)

    const koid = await ctx.requestContext.getAsync(KoidComponent)
    const info = koid.retrieveFromId(reqId)
    assert.ok(typeof info.dataCenter === 'number')
    assert.ok(typeof info.worker === 'number')
    assert.ok(typeof info.timestamp === 'number')

    const xReqId = ctx.response.get(key)
    assert.ok(xReqId === reqId)
  })

  it('should works with existing x-request-id header', async () => {
    const { app, next } = testConfig
    const ctx = app.createAnonymousContext() as Context<any>

    const key = HeadersKey.reqId
    ctx.status = 200

    const input = Math.random().toString()
    assert.ok(input.length)
    // ctx.set(key, input) not works
    ctx.request.headers[key] = input

    const inst = await ctx.requestContext.getAsync(RequestIdMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const { status } = ctx
    assert.ok(status === 200)

    const xReqId = ctx.response.get(key)
    assert.ok(xReqId === input)
  })

})

