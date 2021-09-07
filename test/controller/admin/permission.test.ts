import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../../root.config';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentPermission: any;

  it('should get /admin/permission/query ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/admin/permission/query')
      .query({
        sorter: 'id_descend',
        id: '2',
        name: 'Dash',
        slug: 'dash',
        httpPath: '/',
        httpMethod: 'GET'
      })
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
  });

  it('should get /admin/permission/show ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/admin/permission/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
    const { list } = response.body.data;
    const response2 = await httpRequest
      .get('/admin/permission/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`);
    assert.deepEqual(response2.body.data.id, list[0].id);
  });

  it('should post /admin/permission/create ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
      httpMethod: ['GET', 'POST'],
      httpPath: '/fake/path',
    };
    const response = await httpRequest
      .post('/admin/permission/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201);
    assert.ok(response.body.data);
    currentPermission = response.body.data;
  });

  it('should patch /admin/permission/update ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      id: currentPermission.id,
      httpPath: '/fake/path2',
    };
    const response = await httpRequest
      .patch('/admin/permission/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should delete /admin/permission/remove ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      ids: [currentPermission.id],
    };
    const response = await httpRequest
      .del('/admin/permission/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });
});
