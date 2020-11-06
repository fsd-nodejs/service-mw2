import * as assert from 'power-assert';
import { app } from '@midwayjs/mock/bootstrap';

describe('test/controller/admin/menu.test.ts', () => {
  let currentUser: any;
  let currentMenu: any;
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

  it('should get /admin/menu/query ', async () => {
    app.mockCsrf();
    const response = await app
      .httpRequest()
      .get('/admin/menu/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert(response.body.data.total);
  });

  it('should get /admin/menu/show ', async () => {
    app.mockCsrf();
    const response = await app
      .httpRequest()
      .get('/admin/menu/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert(response.body.data.total);
    const { list } = response.body.data;
    const response2 = await app
      .httpRequest()
      .get('/admin/menu/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`);
    assert.deepEqual(response2.body.data.id, list[0].id);
  });

  it('should post /admin/menu/create ', async () => {
    app.mockCsrf();
    const params = {
      title: 'fakeTitle',
      uri: 'fakeUri',
      roles: ['1'],
      permissionId: '1',
    };
    const response = await app
      .httpRequest()
      .post('/admin/menu/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201);
    assert(response.body.data);
    currentMenu = response.body.data;
  });

  it('should patch /admin/menu/update ', async () => {
    app.mockCsrf();
    const params = {
      id: currentMenu.id,
      title: 'fakeTitle2',
      uri: 'fakeUri2',
      roles: [],
      permissionId: '2',
    };
    const response = await app
      .httpRequest()
      .patch('/admin/menu/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should delete /admin/menu/remove ', async () => {
    app.mockCsrf();
    const params = {
      ids: [currentMenu.id],
    };
    const response = await app
      .httpRequest()
      .del('/admin/menu/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should order /admin/menu/order ', async () => {
    app.mockCsrf();
    const response1 = await app
      .httpRequest()
      .get('/admin/menu/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.deepEqual(response1.status, 200);

    const newList = response1.body.data.list.map((item: any) => {
      return {
        id: item.id,
        parentId: item.parentId,
      };
    });

    const response2 = await app
      .httpRequest()
      .post('/admin/menu/order')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send({
        orders: newList,
      })
      .expect(200);
    assert.deepEqual(response2.status, 200);
  });
});
