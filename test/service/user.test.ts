import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close } from '@midwayjs/mock';
import { Application } from 'egg';

import { AdminUserService } from '../../src/app/service/admin/user';

describe('test/service/user.test.ts', () => {
  let app: Application;
  let currentUser: any;

  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('#queryAdminUser >should get user list total > 0', async () => {
    const userService = await app.applicationContext.getAsync<AdminUserService>(
      'adminUserService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { total } = await userService.queryAdminUser(queryParams);
    assert(total);
  });

  it('#queryAdminUser >should get user list and query by id', async () => {
    const userService = await app.applicationContext.getAsync<AdminUserService>(
      'adminUserService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await userService.queryAdminUser(queryParams);
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      id: list[0].id,
    });

    assert(total);
  });

  it('#queryAdminUser >should get user list and query by name', async () => {
    const userService = await app.applicationContext.getAsync<AdminUserService>(
      'adminUserService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await userService.queryAdminUser(queryParams);
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      name: list[0].name,
    });

    assert(total);
  });

  it('#queryAdminUser >should get user list and query by username', async () => {
    const userService = await app.applicationContext.getAsync<AdminUserService>(
      'adminUserService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { list } = await userService.queryAdminUser(queryParams);
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      username: list[0].username,
    });

    assert(total);
  });

  it('#createAdminUser >should created user', async () => {
    const ctx = app.mockContext();
    const userService = await ctx.requestContext.getAsync<AdminUserService>(
      'adminUserService'
    );
    const params = {
      name: 'fakeName3',
      username: 'fakeUserName3',
      password: ctx.helper.bhash('123456'),
      roles: ['1'],
      permissions: ['1'],
    };
    const user = await userService.createAdminUser(params);

    assert(user);
    currentUser = user;
  });

  it('#queryAdminUser >should get user list and sorter by id asc', async () => {
    const userService = await app.applicationContext.getAsync<AdminUserService>(
      'adminUserService'
    );
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
    const userService = await app.applicationContext.getAsync<AdminUserService>(
      'adminUserService'
    );
    const user = await userService.getAdminUserById(currentUser.id);

    assert(user);
  });

  it('#updateAdminUser >should update user', async () => {
    const ctx = app.mockContext();
    const userService = await ctx.requestContext.getAsync<AdminUserService>(
      'adminUserService'
    );
    const { id } = currentUser;
    const { affected } = await userService.updateAdminUser({
      id,
      name: 'fakeName4',
      username: 'fakeUserName4',
      password: '123456',
      roles: [],
      permissions: [],
    });
    assert(affected);
  });

  it('#removeAdminUserByIds >should remove user', async () => {
    const userService = await app.applicationContext.getAsync<AdminUserService>(
      'adminUserService'
    );
    const { id } = currentUser;
    const total = await userService.removeAdminUserByIds([id]);
    assert(total);
  });
});
