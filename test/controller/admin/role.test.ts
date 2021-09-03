import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../../root.config';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentRole: any;

  it('should get /admin/role/query ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/admin/role/query')
      .query({
        sorter: 'id_descend',
        id: '1',
        name: 'Admin',
        slug: 'admin'
      })
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
  });

  it('should get /admin/role/show ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/admin/role/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
    const { list } = response.body.data;

    const response2 = await httpRequest
      .get('/admin/role/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`);
    assert.deepEqual(response2.body.data.id, list[0].id);
  });

  it('should post /admin/role/create ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
      permissions: ['2', '3']
    };
    const response = await httpRequest
      .post('/admin/role/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201);
    assert.ok(response.body.data);
    currentRole = response.body.data;
  });

  it('should patch /admin/role/update ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      id: currentRole.id,
      slug: 'fakeSlug2',
      permissions: ['2']
    };
    const response = await httpRequest
      .patch('/admin/role/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should delete /admin/role/remove ', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const params = {
      ids: [currentRole.id],
    };
    const response = await httpRequest
      .del('/admin/role/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });
});
