import * as assert from 'power-assert'
import { app } from '@midwayjs/mock/bootstrap'
import { AuthService } from '../../src/app/service/auth'

describe('test/service/authService.test.ts', () => {
  it('#getAdminUserByUserName >should get exists user', async () => {
    const authService = await app.applicationContext.getAsync<AuthService>('AuthService')
    const user = await authService.getAdminUserByUserName('admin')
    assert(user)
    assert.deepEqual(user?.username, 'admin')
  })

  it('#getAdminUserTokenById >should get null when user not exists', async () => {
    const authService = await app.applicationContext.getAsync<AuthService>('AuthService')
    const user = await authService.getAdminUserByUserName('fakeAdmin')
    assert.deepEqual(user, null)
  })

  it('#localHandler >should get exists user and password is passed', async () => {
    const ctx = app.mockContext()
    const authService = await ctx.requestContext.getAsync<AuthService>('AuthService')
    const params = { username: 'admin', password: 'admin' }
    const user = await authService.localHandler(params)
    assert(user)
    assert.deepEqual(user?.username, params.username)
  })

  it('#localHandler >should get null when user not exists', async () => {
    const ctx = app.mockContext()
    const authService = await ctx.requestContext.getAsync<AuthService>('AuthService')
    const params = { username: 'fakeAdmin', password: 'admin' }
    const user = await authService.localHandler(params)
    assert.deepEqual(user, null)
  })

  it('#localHandler >should get null when user password not equal', async () => {
    const ctx = app.mockContext()
    const authService = await ctx.requestContext.getAsync<AuthService>('AuthService')
    const params = { username: 'admin', password: '123456' }
    const user = await authService.localHandler(params)
    assert.deepEqual(user, null)
  })

  it('#createAdminUserToken >should created token to redis', async () => {
    const authService = await app.applicationContext.getAsync<AuthService>('AuthService')
    const user = await authService.getAdminUserByUserName('admin')
    assert(user)
    const token = user && await authService.createAdminUserToken(user)
    assert(token)
  })

  it('#getAdminUserTokenById >should get token from redis', async () => {
    const authService = await app.applicationContext.getAsync<AuthService>('AuthService')
    const user = await authService.getAdminUserByUserName('admin')
    assert(user)
    const token = user && await authService.getAdminUserTokenById(user.id)
    assert(token)
  })

  it('#removeAdminUserTokenById >should remove token from redis', async () => {
    const authService = await app.applicationContext.getAsync<AuthService>('AuthService')
    const user = await authService.getAdminUserByUserName('admin')
    assert(user)
    const removed = user && await authService.removeAdminUserTokenById(user.id)
    assert(removed)
  })

  it('#cacheAdminUser >should get OK when cached user to redis', async () => {
    const authService = await app.applicationContext.getAsync<AuthService>('AuthService')
    const user = await authService.getAdminUserByUserName('admin')
    assert(user)
    const cached = user && await authService.cacheAdminUser(user)
    assert.deepEqual(cached, 'OK')
  })

  it('#getAdminUserById >should get userinfo from redis', async () => {
    const authService = await app.applicationContext.getAsync<AuthService>('AuthService')
    const user = await authService.getAdminUserByUserName('admin')
    assert(user)
    const userinfo = user && await authService.getAdminUserById(user.id)
    assert(userinfo)
    assert.deepEqual(userinfo?.username, user?.username)
  })

  it('#cleanAdminUserById >should remove userinfo from redis', async () => {
    const authService = await app.applicationContext.getAsync<AuthService>('AuthService')
    const user = await authService.getAdminUserByUserName('admin')
    assert(user)
    const removed = user && await authService.cleanAdminUserById(user.id)
    assert(removed)
  })
})
