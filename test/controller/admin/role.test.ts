import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application } from 'egg';

describe('test/controller/admin/role.test.ts', () => {
  let app: Application;
  let currentUser: any;
  let currentRole: any;
  beforeAll(async () => {
    app = await createApp<Framework>();

    const response = await createHttpRequest(app)
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);
    currentUser = response.body.data;
  });

  afterAll(async () => {
    close(app);
  });

  it('should get /admin/role/query ', async () => {
    const response = await createHttpRequest(app)
      .get('/admin/role/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert(response.body.data.total);
  });

  it('should get /admin/role/show ', async () => {
    const response = await createHttpRequest(app)
      .get('/admin/role/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert(response.body.data.total);
    const { list } = response.body.data;
    const response2 = await createHttpRequest(app)
      .get('/admin/role/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`);
    assert.deepEqual(response2.body.data.id, list[0].id);
  });

  it('should post /admin/role/create ', async () => {
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
    };
    const response = await createHttpRequest(app)
      .post('/admin/role/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201);
    assert(response.body.data);
    currentRole = response.body.data;
  });

  it('should patch /admin/role/update ', async () => {
    const params = {
      id: currentRole.id,
      slug: 'fakeSlug2',
    };
    const response = await createHttpRequest(app)
      .patch('/admin/role/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should delete /admin/role/remove ', async () => {
    const params = {
      ids: [currentRole.id],
    };
    const response = await createHttpRequest(app)
      .del('/admin/role/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });
});
