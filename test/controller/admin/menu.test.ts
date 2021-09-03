import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../../root.config';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentMenu: any;

  it('should get /admin/menu/query ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/admin/menu/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
  });

  it('should get /admin/menu/show ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/admin/menu/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);

    const { list } = response.body.data;
    const response2 = await httpRequest
      .get('/admin/menu/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`);
    assert.deepEqual(response2.body.data.id, list[0].id);
  });

  it('should post /admin/menu/create ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      title: 'fakeTitle',
      uri: 'fakeUri',
      roles: ['1'],
      permissionId: '1',
    };
    const response = await httpRequest
      .post('/admin/menu/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201);
    assert.ok(response.body.data);
    currentMenu = response.body.data;
  });

  it('should patch /admin/menu/update ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      id: currentMenu.id,
      title: 'fakeTitle2',
      uri: 'fakeUri2',
      roles: ['1'],
      permissionId: '2',
    };
    const response = await httpRequest
      .patch('/admin/menu/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should delete /admin/menu/remove ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      ids: [currentMenu.id],
    };
    const response = await httpRequest
      .del('/admin/menu/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should order /admin/menu/order ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response1 = await httpRequest
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

    const response2 = await httpRequest
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
