import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close } from '@midwayjs/mock';
import { Application } from 'egg';
import { AdminRoleService } from '../../src/app/service/admin/role';

describe('test/service/role.test.ts', () => {
  let app: Application;
  let currentRole: any;

  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('#queryAdminRole >should get role list total > 0', async () => {
    const roleService = await app.applicationContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { total } = await roleService.queryAdminRole(queryParams);
    assert(total);
  });

  it('#queryAdminRole >should get role list and query by id', async () => {
    const roleService = await app.applicationContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await roleService.queryAdminRole(queryParams);
    const { total } = await roleService.queryAdminRole({
      ...queryParams,
      id: list[0].id,
    });

    assert(total);
  });

  it('#queryAdminRole >should get role list and query by name', async () => {
    const roleService = await app.applicationContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await roleService.queryAdminRole(queryParams);
    const { total } = await roleService.queryAdminRole({
      ...queryParams,
      name: list[0].name,
    });

    assert(total);
  });

  it('#queryAdminRole >should get role list and query by slug', async () => {
    const roleService = await app.applicationContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await roleService.queryAdminRole(queryParams);
    const { total } = await roleService.queryAdminRole({
      ...queryParams,
      slug: list[0].slug,
    });

    assert(total);
  });

  it('#createAdminRole >should created role', async () => {
    const ctx = app.mockContext();
    const roleService = await ctx.requestContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
      permissions: ['1'],
    };
    const role = await roleService.createAdminRole(params);

    assert(role);
    currentRole = role;
  });

  it('#queryAdminRole >should get role list and sorter by id asc', async () => {
    const roleService = await app.applicationContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list: descList } = await roleService.queryAdminRole(queryParams);
    const { list: ascList } = await roleService.queryAdminRole({
      ...queryParams,
      sorter: 'id_asc',
    });

    assert.notDeepEqual(descList[0].id, ascList[0].id);
  });

  it('#getAdminRoleById >should get role by id', async () => {
    const roleService = await app.applicationContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const role = await roleService.getAdminRoleById(currentRole.id);

    assert(role);
  });

  it('#updateAdminRole >should update role', async () => {
    const ctx = app.mockContext();
    const roleService = await ctx.requestContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const { id } = currentRole;
    const { affected } = await roleService.updateAdminRole({
      id,
      name: 'fakeName2',
      permissions: ['2'],
      slug: 'fakeSlug2'
    });
    assert(affected);
  });

  it('#removeAdminRoleByIds >should remove role', async () => {
    const roleService = await app.applicationContext.getAsync<AdminRoleService>(
      'adminRoleService'
    );
    const { id } = currentRole;
    const total = await roleService.removeAdminRoleByIds([id]);
    assert(total);
  });
});
