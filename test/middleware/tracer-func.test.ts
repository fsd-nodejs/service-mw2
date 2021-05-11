import * as assert from 'assert'

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

  it('Should processPriority() works', async () => {
    const ctx: Context = app.createAnonymousContext()
    const inst = await ctx.requestContext.getAsync(TraceMiddleware)
    const mw = inst.resolve()
    // @ts-expect-error
    await mw(ctx, next)

    const fnName = 'processPriority'
    const fn = mods.__get__(fnName) as (options: ProcessPriorityOpts) => true | undefined

    const opts: ProcessPriorityOpts = {
      starttime: ctx.starttime,
      trm: ctx.tracerManager,
      tracerConfig: ctx.app.config.tracer,
    };

    opts.tracerConfig.reqThrottleMsForPriority = -1
    const ret1 = fn(opts);
    assert(typeof ret1 === 'undefined')

    opts.tracerConfig.reqThrottleMsForPriority = 10000
    const ret2 = fn(opts);
    assert(typeof ret2 === 'undefined')

    opts.tracerConfig.reqThrottleMsForPriority = 0.1
    const ret3 = fn(opts);
    assert(ret3 === true)

    opts.tracerConfig.reqThrottleMsForPriority = 0
    const ret4 = fn(opts);
    assert(ret4 === true)
  })

})


async function next(): Promise<void> {
  return void 0
}

