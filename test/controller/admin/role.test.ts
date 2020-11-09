
import * as assert from 'power-assert'
import { app } from '@midwayjs/mock/bootstrap';


describe('test/controller/admin/role.test.ts', () => {
  let currentUser: any
  let currentRole: any
  beforeAll(async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200)
    currentUser = response.body.data
  })

  it('should get /admin/role/query ', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .get('/admin/role/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert(response.body.data.total)
  })

  it('should get /admin/role/show ', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .get('/admin/role/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert(response.body.data.total)
    const { list } = response.body.data
    const response2 = await app.httpRequest()
      .get('/admin/role/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`)
    assert.deepEqual(response2.body.data.id, list[0].id)
  })

  it('should post /admin/role/create ', async () => {
    app.mockCsrf()
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
    }
    const response = await app.httpRequest()
      .post('/admin/role/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201)
    assert(response.body.data)
    currentRole = response.body.data
  })

  it('should patch /admin/role/update ', async () => {
    app.mockCsrf()
    const params = {
      id: currentRole.id,
      slug: 'fakeSlug2',
    }
    const response = await app.httpRequest()
      .patch('/admin/role/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204)
    assert.deepEqual(response.status, 204)
  })

  it('should delete /admin/role/remove ', async () => {
    app.mockCsrf()
    const params = {
      ids: [currentRole.id],
    }
    const response = await app.httpRequest()
      .del('/admin/role/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204)
    assert.deepEqual(response.status, 204)
  })
})
