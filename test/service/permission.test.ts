
import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';
import { AdminPermissionService } from '../../src/app/service/admin/permission';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentPermission: any;

  it('#queryAdminPermission >should get permission list total > 0', async () => {
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { total } = await permissionService.queryAdminPermission(queryParams);
    assert.ok(total);
  });

  it('#queryAdminPermission >should get permission list and sorter by id asc', async () => {
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
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
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
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
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
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
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
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
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
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
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
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
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
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
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
    const permission = await permissionService.getAdminPermissionById(
      currentPermission.id
    );

    assert.ok(permission);
  });

  it('#updateAdminPermission >should update permission', async () => {
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
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
    const { container } = testConfig

    const permissionService = await container.getAsync(AdminPermissionService);
    const { id } = currentPermission;
    const total = await permissionService.removeAdminPermissionByIds([id]);
    assert.ok(total);
  });
});
