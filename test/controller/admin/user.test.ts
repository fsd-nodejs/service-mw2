
import * as assert from 'power-assert'
import { app } from '@midwayjs/mock/bootstrap';


describe('test/controller/admin/user.test.ts', () => {
  let currentUser: any
  let currentAdminUser: any
  beforeAll(async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200)
    currentUser = response.body.data
  })

  it('should get /admin/user/query ', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .get('/admin/user/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert(response.body.data.total)
  })

  it('should get /admin/user/show ', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .get('/admin/user/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert(response.body.data.total)
    const { list } = response.body.data
    const response2 = await app.httpRequest()
      .get('/admin/user/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`)
    assert.deepEqual(response2.body.data.id, list[0].id)
  })

  it('should post /admin/user/create ', async () => {
    app.mockCsrf()
    const params = {
      name: 'fakeName',
      username: 'fakeUserName',
      password: '123456',
    }
    const response = await app.httpRequest()
      .post('/admin/user/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201)
    assert(response.body.data)
    currentAdminUser = response.body.data
  })

  it('should patch /admin/user/update ', async () => {
    app.mockCsrf()
    const params = {
      id: currentAdminUser.id,
      name: 'fakeName2',
      username: 'fakeUserName2',
      password: '123456',
      roles: [],
      permissions: [],
    }
    const response = await app.httpRequest()
      .patch('/admin/user/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204)
    assert.deepEqual(response.status, 204)
  })

  it('should delete /admin/user/remove ', async () => {
    app.mockCsrf()
    const params = {
      ids: [currentAdminUser.id],
    }
    const response = await app.httpRequest()
      .del('/admin/user/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204)
    assert.deepEqual(response.status, 204)
  })
})
