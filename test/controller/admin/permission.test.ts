import * as assert from 'power-assert';
import { app } from '@midwayjs/mock/bootstrap';

describe('test/controller/admin/permission.test.ts', () => {
  let currentUser: any;
  let currentPermission: any;
  beforeAll(async () => {
    app.mockCsrf();
    const response = await app
      .httpRequest()
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);
    currentUser = response.body.data;
  });

  it('should get /admin/permission/query ', async () => {
    app.mockCsrf();
    const response = await app
      .httpRequest()
      .get('/admin/permission/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert(response.body.data.total);
  });

  it('should get /admin/permission/show ', async () => {
    app.mockCsrf();
    const response = await app
      .httpRequest()
      .get('/admin/permission/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert(response.body.data.total);
    const { list } = response.body.data;
    const response2 = await app
      .httpRequest()
      .get('/admin/permission/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`);
    assert.deepEqual(response2.body.data.id, list[0].id);
  });

  it('should post /admin/permission/create ', async () => {
    app.mockCsrf();
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
      httpMethod: ['GET', 'POST'],
      httpPath: '/fake/path',
    };
    const response = await app
      .httpRequest()
      .post('/admin/permission/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201);
    assert(response.body.data);
    currentPermission = response.body.data;
  });

  it('should patch /admin/permission/update ', async () => {
    app.mockCsrf();
    const params = {
      id: currentPermission.id,
      httpPath: '/fake/path2',
    };
    const response = await app
      .httpRequest()
      .patch('/admin/permission/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should delete /admin/permission/remove ', async () => {
    app.mockCsrf();
    const params = {
      ids: [currentPermission.id],
    };
    const response = await app
      .httpRequest()
      .del('/admin/permission/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });
});
