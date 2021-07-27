import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close } from '@midwayjs/mock';

import { Application } from '../../src/interface';
import { AdminPermissionService } from '../../src/app/service/admin/permission';

describe('test/service/permission.test.ts', () => {
  let app: Application;
  let currentPermission: any;

  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('#queryAdminPermission >should get permission list total > 0', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { total } = await permissionService.queryAdminPermission(queryParams);
    assert.ok(total);
  });

  it('#queryAdminPermission >should get permission list and sorter by id asc', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list: descList } = await permissionService.queryAdminPermission(
      queryParams
    );
    const { list: ascList } = await permissionService.queryAdminPermission({
      ...queryParams,
      sorter: 'id_asc',
    });

    assert.notDeepEqual(descList[0].id, ascList[0].id);
  });

  it('#queryAdminPermission >should get permission list and query by id', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await permissionService.queryAdminPermission(queryParams);
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      id: list[0].id,
    });

    assert.ok(total);
  });

  it('#queryAdminPermission >should get permission list and query by name', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await permissionService.queryAdminPermission(queryParams);
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      name: list[0].name,
    });

    assert.ok(total);
  });

  it('#queryAdminPermission >should get permission list and query by slug', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await permissionService.queryAdminPermission(queryParams);
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      slug: list[0].slug,
    });

    assert.ok(total);
  });

  it('#queryAdminPermission >should get permission list and query by httpPath', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await permissionService.queryAdminPermission(queryParams);
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      httpPath: list[0].httpPath,
    });

    assert.ok(total);
  });

  it('#queryAdminPermission >should get permission list and query by httpMethod', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await permissionService.queryAdminPermission(queryParams);
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      httpMethod: list[0].httpMethod[0],
    });

    assert.ok(total);
  });

  it('#createAdminPermission >should created permission', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
      httpPath: '/fake/path',
      httpMethod: ['GET']
    };
    const permission = await permissionService.createAdminPermission(params);

    assert.ok(permission);
    currentPermission = permission;
  });

  it('#getAdminPermissionById >should get permission by id', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const permission = await permissionService.getAdminPermissionById(
      currentPermission.id
    );

    assert.ok(permission);
  });

  it('#updateAdminPermission >should update permission', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const { id } = currentPermission;
    const { affected } = await permissionService.updateAdminPermission({
      id,
      name: 'fake2',
      httpPath: '/fake/path2',
      slug: 'fakeSlug',
      httpMethod: ['GET']
    });
    assert.ok(affected);
  });

  it('#removeAdminPermissionByIds >should remove permission', async () => {
    const permissionService = await app.applicationContext.getAsync<
      AdminPermissionService
    >('adminPermissionService');
    const { id } = currentPermission;
    const total = await permissionService.removeAdminPermissionByIds([id]);
    assert.ok(total);
  });
});
