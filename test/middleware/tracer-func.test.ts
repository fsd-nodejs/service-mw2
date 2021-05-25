import * as assert from 'power-assert'

import { createApp, close } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { basename } from '@waiting/shared-core'
import { Application, Context } from 'egg'

import { TraceMiddleware, ProcessPriorityOpts } from '../../src/app/middleware/tracer'

import rewire = require('rewire')


const filename = basename(__filename)

describe(filename, () => {
  const mods = rewire('../../src/app/middleware/tracer')
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })

  describe('Should processPriority() works', () => {

    it('reqThrottleMsForPriority -1', async () => {
      const ctx: Context = app.createAnonymousContext()
      ctx.app.config.tracer.reqThrottleMsForPriority = -100

      const inst = await ctx.requestContext.getAsync(TraceMiddleware)
      const mw = inst.resolve()
      // @ts-expect-error
      await mw(ctx, next)

      const fnName = 'processPriority'
      const fn = mods.__get__(fnName) as (options: ProcessPriorityOpts) => number | undefined

      const opts: ProcessPriorityOpts = {
        starttime: ctx.starttime,
        trm: ctx.tracerManager,
        tracerConfig: ctx.app.config.tracer,
      }
      const cost = fn(opts)
      assert(typeof cost === 'undefined')
    })

    it('reqThrottleMsForPriority 10000', async () => {
      const ctx: Context = app.createAnonymousContext()
      ctx.app.config.tracer.reqThrottleMsForPriority = 10000

      const inst = await ctx.requestContext.getAsync(TraceMiddleware)
      const mw = inst.resolve()
      // @ts-expect-error
      await mw(ctx, next)

      const fnName = 'processPriority'
      const fn = mods.__get__(fnName) as (options: ProcessPriorityOpts) => number | undefined

      const opts: ProcessPriorityOpts = {
        starttime: ctx.starttime,
        trm: ctx.tracerManager,
        tracerConfig: ctx.app.config.tracer,
      }
      const cost = fn(opts)
      assert(cost < ctx.app.config.tracer.reqThrottleMsForPriority)
    })

    it('reqThrottleMsForPriority zero', async () => {
      const ctx: Context = app.createAnonymousContext()
      ctx.app.config.tracer.reqThrottleMsForPriority = 0

      const inst = await ctx.requestContext.getAsync(TraceMiddleware)
      const mw = inst.resolve()
      // @ts-expect-error
      await mw(ctx, next)

      const fnName = 'processPriority'
      const fn = mods.__get__(fnName) as (options: ProcessPriorityOpts) => number | undefined

      const opts: ProcessPriorityOpts = {
        starttime: ctx.starttime,
        trm: ctx.tracerManager,
        tracerConfig: ctx.app.config.tracer,
      }
      const cost = fn(opts)
      assert(cost >= ctx.app.config.tracer.reqThrottleMsForPriority)
    })

  })
})


async function next(): Promise<void> {
  return void 0
}

