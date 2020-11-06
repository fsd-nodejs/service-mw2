
import * as assert from 'power-assert'
import { app } from '@midwayjs/mock/bootstrap'


describe('test/controller/home.test.ts', () => {
  let currentUser: any
  beforeAll(async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200)
    currentUser = response.body.data
  })

  it('should assert', async () => {
    const pkg = require('../../package.json')
    assert(app.config.keys.startsWith(pkg.name))
    // const ctx = app.mockContext({});
    // await ctx.service.xx();
  })

  it('should GET /', async () => {
    const response = await app.httpRequest()
      .get('/')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)

    const msg: string = response.text
    assert(msg && msg.includes('Hello midwayjs!'))
  })

  it('should GET /ping', async () => {
    const ret = await app.httpRequest()
      .get('/ping')
      .expect(200)

    const msg: string = ret.text
    assert(msg && msg === 'OK')
  })

})
