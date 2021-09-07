
import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';
import { AdminRoleService } from '../../src/app/service/admin/role';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentRole: any;

  it('#queryAdminRole >should get role list total > 0', async () => {
    const { container } = testConfig

    const roleService = await container.getAsync(AdminRoleService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { total } = await roleService.queryAdminRole(queryParams);
    assert.ok(total);
  });

  it('#queryAdminRole >should get role list and query by id', async () => {
    const { container } = testConfig

    const roleService = await container.getAsync(AdminRoleService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await roleService.queryAdminRole(queryParams);
    const { total } = await roleService.queryAdminRole({
      ...queryParams,
      id: list[0].id,
    });

    assert.ok(total);
  });

  it('#queryAdminRole >should get role list and query by name', async () => {
    const { container } = testConfig

    const roleService = await container.getAsync(AdminRoleService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await roleService.queryAdminRole(queryParams);
    const { total } = await roleService.queryAdminRole({
      ...queryParams,
      name: list[0].name,
    });

    assert.ok(total);
  });

  it('#queryAdminRole >should get role list and query by slug', async () => {
    const { container } = testConfig

    const roleService = await container.getAsync(AdminRoleService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await roleService.queryAdminRole(queryParams);
    const { total } = await roleService.queryAdminRole({
      ...queryParams,
      slug: list[0].slug,
    });

    assert.ok(total);
  });

  it('#createAdminRole >should created role', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const roleService = await ctx.requestContext.getAsync(AdminRoleService);
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
      permissions: ['1'],
    };
    const role = await roleService.createAdminRole(params);

    assert.ok(role);
    currentRole = role;
  });

  it('#queryAdminRole >should get role list and sorter by id asc', async () => {
    const { container } = testConfig

    const roleService = await container.getAsync(AdminRoleService);
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
    const { container } = testConfig

    const roleService = await container.getAsync(AdminRoleService);
    const role = await roleService.getAdminRoleById(currentRole.id);

    assert.ok(role);
  });

  it('#updateAdminRole >should update role', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const roleService = await ctx.requestContext.getAsync(AdminRoleService);
    const { id } = currentRole;
    const { affected } = await roleService.updateAdminRole({
      id,
      name: 'fakeName2',
      permissions: ['2'],
      slug: 'fakeSlug2'
    });
    assert.ok(affected);
  });

  it('#removeAdminRoleByIds >should remove role', async () => {
    const { container } = testConfig

    const roleService = await container.getAsync(AdminRoleService);
    const { id } = currentRole;
    const total = await roleService.removeAdminRoleByIds([id]);
    assert.ok(total);
  });

  it('#createAdminRole >should created role, no permission', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const roleService = await ctx.requestContext.getAsync(AdminRoleService);
    const params = {
      name: 'fakeName3',
      slug: 'fakeSlug3',
    };
    const role = await roleService.createAdminRole(params);

    assert.ok(role);
  });
});
