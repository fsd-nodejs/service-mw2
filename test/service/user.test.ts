import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';
import { AdminUserService } from '../../src/app/service/admin/user';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentUser: any;

  it('#queryAdminUser >should get user list total > 0', async () => {
    const { container } = testConfig

    const userService = await container.getAsync(AdminUserService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { total } = await userService.queryAdminUser(queryParams);
    assert.ok(total);
  });

  it('#queryAdminUser >should get user list and query by id', async () => {
    const { container } = testConfig

    const userService = await container.getAsync(AdminUserService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await userService.queryAdminUser(queryParams);
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      id: list[0].id,
    });

    assert.ok(total);
  });

  it('#queryAdminUser >should get user list and query by name', async () => {
    const { container } = testConfig

    const userService = await container.getAsync(AdminUserService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await userService.queryAdminUser(queryParams);
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      name: list[0].name,
    });

    assert.ok(total);
  });

  it('#queryAdminUser >should get user list and query by username', async () => {
    const { container } = testConfig

    const userService = await container.getAsync(AdminUserService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await userService.queryAdminUser(queryParams);
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      username: list[0].username,
    });

    assert.ok(total);
  });

  it('#createAdminUser >should created user', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const userService = await ctx.requestContext.getAsync(AdminUserService);
    const params = {
      name: 'fakeName3',
      username: 'fakeUserName3',
      password: ctx.helper.bhash('123456'),
      roles: ['1'],
      permissions: ['1'],
    };
    const user = await userService.createAdminUser(params);

    assert.ok(user);
    currentUser = user;
  });

  it('#queryAdminUser >should get user list and sorter by id asc', async () => {
    const { container } = testConfig

    const userService = await container.getAsync(AdminUserService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list: descList } = await userService.queryAdminUser(queryParams);
    const { list: ascList } = await userService.queryAdminUser({
      ...queryParams,
      sorter: 'id_asc',
    });

    assert.notDeepEqual(descList[0].id, ascList[0].id);
  });

  it('#getAdminUserById >should get user by id', async () => {
    const { container } = testConfig

    const userService = await container.getAsync(AdminUserService);
    const user = await userService.getAdminUserById(currentUser.id);

    assert.ok(user);
  });

  it('#updateAdminUser >should update user', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const userService = await ctx.requestContext.getAsync(AdminUserService);
    const { id } = currentUser;
    const { affected } = await userService.updateAdminUser({
      id,
      name: 'fakeName4',
      username: 'fakeUserName4',
      password: '123456',
      roles: [],
      permissions: [],
    });
    assert.ok(affected);
  });

  it('#removeAdminUserByIds >should remove user', async () => {
    const { container } = testConfig

    const userService = await container.getAsync(AdminUserService);
    const { id } = currentUser;
    const total = await userService.removeAdminUserByIds([id]);
    assert.ok(total);
  });

  it('#createAdminUser >should created user, no role, no permission', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const userService = await ctx.requestContext.getAsync(AdminUserService);
    const params = {
      name: 'fakeName5',
      username: 'fakeUserName5',
      password: ctx.helper.bhash('123456'),
    };
    const user = await userService.createAdminUser(params);

    assert.ok(user);
  });
});
