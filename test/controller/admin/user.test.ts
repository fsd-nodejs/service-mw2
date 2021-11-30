import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../../root.config';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentAdminUser: any;

  it('should get /admin/user/query ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/admin/user/query')
      .query({
        sorter: 'id_descend',
        id: '1',
        name: 'Admin',
        username: 'admin',
      })
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
  });

  it('should get /admin/user/show ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/admin/user/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
    const { list } = response.body.data;

    const response2 = await httpRequest
      .get('/admin/user/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`);
    assert.deepEqual(response2.body.data.id, list[0].id);
  });

  it('should post /admin/user/create ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      name: 'fakeName',
      username: 'fakeUserName',
      password: '123456',
      roles: ['1'],
      permissions: ['1'],
    };
    const response = await httpRequest
      .post('/admin/user/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201);
    assert.ok(response.body.data);
    currentAdminUser = response.body.data;
  });

  it('should patch /admin/user/update ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      id: currentAdminUser.id,
      name: 'fakeName2',
      username: 'fakeUserName2',
      password: '1234567',
      roles: ['1'],
      permissions: ['1'],
    };
    const response = await httpRequest
      .patch('/admin/user/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should delete /admin/user/remove ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      ids: [currentAdminUser.id],
    };
    const response = await httpRequest
      .del('/admin/user/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });
});
