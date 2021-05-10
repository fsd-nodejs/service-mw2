
import { createApp, close } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { basename } from '@waiting/shared-core'
import { Application } from 'egg'

import { TracerManager } from '../../src/app/util/tracer'


const filename = basename(__filename)

describe(filename, () => {
  let app: Application

  beforeAll(async () => {
    app = await createApp<Framework>()
  })
  afterAll(async () => {
    await close(app)
  })
  it('should works if enabled', async () => {
    const tracerManager = new TracerManager(true)
    tracerManager.startSpan('mySpan')
    expect(tracerManager.currentSpan()).toBeTruthy()
    tracerManager.finishSpan()
    expect(tracerManager.currentSpan()).toBeUndefined()
  })
  it('new span should be child of preceding span', async () => {
    const traceHeaderKey = 'uber-trace-id'
    const tracerManager = new TracerManager(true)
    tracerManager.startSpan('span1')
    const span1Header = tracerManager.headerOfCurrentSpan()[traceHeaderKey]
    tracerManager.startSpan('span2')
    const span2Header = tracerManager.headerOfCurrentSpan()[traceHeaderKey]
    expect(span2Header?.split(':')[2]).toEqual(span1Header?.split(':')[0])
  })
  it('should not works if disabled', async () => {
    const tracerManager = new TracerManager(false)
    tracerManager.startSpan('mySpan')
    expect(tracerManager.currentSpan()).toBeUndefined()
  })
  it('should header be {} if no span', async () => {
    const tracerManager = new TracerManager(false)
    expect(tracerManager.headerOfCurrentSpan()).toMatchObject({})
  })
})

