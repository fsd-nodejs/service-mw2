import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';

import { AuthService } from '../../src/app/service/auth';

const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  it('#getAdminUserByUserName >should get exists user', async () => {
    const { container } = testConfig

    const authService = await container.getAsync(AuthService);
    const user = await authService.getAdminUserByUserName('admin');
    assert.ok(user);
    assert.deepStrictEqual(user.username, 'admin');
  });

  it.skip('#getAdminUserTokenById >should get null when user not exists', async () => {
    const { container } = testConfig

    const authService = await container.getAsync(AuthService);
    const user = await authService.getAdminUserByUserName('fakeAdmin');
    assert.deepStrictEqual(user, null);
  });

  it('#localHandler >should get exists user and password is passed', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const authService = await ctx.requestContext.getAsync(AuthService);
    const params = { username: 'admin', password: 'admin' };
    const user = await authService.localHandler(params);
    assert.ok(user);
    assert.deepStrictEqual(user.username, params.username);
  });

  it('#localHandler >should get null when user not exists', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const authService = await ctx.requestContext.getAsync(AuthService);
    const params = { username: 'fakeAdmin', password: 'admin' };
    const user = await authService.localHandler(params);
    assert.deepStrictEqual(user, null);
  });

  it('#localHandler >should get null when user password not equal', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext();

    const authService = await ctx.requestContext.getAsync(AuthService);
    const params = { username: 'admin', password: '123456' };
    const user = await authService.localHandler(params);
    assert.deepStrictEqual(user, null);
  });

  it('#createAdminUserToken >should created token to redis', async () => {
    const { app } = testConfig

    const authService = await app.applicationContext.getAsync(AuthService);
    const user = await authService.getAdminUserByUserName('admin');
    assert.ok(user);
    const token = user && (await authService.createAdminUserToken(user));
    assert.ok(token);
  });

  it('#getAdminUserTokenById >should get token from redis', async () => {
    const { app } = testConfig

    const authService = await app.applicationContext.getAsync(AuthService);
    const user = await authService.getAdminUserByUserName('admin');
    assert.ok(user);
    const token = user && (await authService.getAdminUserTokenById(user.id));
    assert.ok(token);
  });

  it('#removeAdminUserTokenById >should remove token from redis', async () => {
    const { app } = testConfig

    const authService = await app.applicationContext.getAsync(AuthService);
    const user = await authService.getAdminUserByUserName('admin');
    assert.ok(user);
    const removed =
      user && (await authService.removeAdminUserTokenById(user.id));
    assert.ok(removed);
  });

  it('#cacheAdminUser >should get OK when cached user to redis', async () => {
    const { app } = testConfig

    const authService = await app.applicationContext.getAsync(AuthService);
    const user = await authService.getAdminUserByUserName('admin');
    assert.ok(user);
    const cached = user && (await authService.cacheAdminUser(user));
    assert.deepStrictEqual(cached, 'OK');
  });

  it('#getAdminUserById >should get userinfo from redis', async () => {
    const { app } = testConfig

    const authService = await app.applicationContext.getAsync(AuthService);
    const user = await authService.getAdminUserByUserName('admin');
    assert.ok(user);
    const userinfo = user && (await authService.getAdminUserById(user.id));
    assert.ok(userinfo);
    assert.deepStrictEqual(userinfo.username, user.username);
  });

  it('#cleanAdminUserById >should remove userinfo from redis', async () => {
    const { app } = testConfig

    const authService = await app.applicationContext.getAsync(AuthService);
    const user = await authService.getAdminUserByUserName('admin');
    assert.ok(user);
    const removed = user && (await authService.cleanAdminUserById(user.id));
    assert.ok(removed);
  });
});
