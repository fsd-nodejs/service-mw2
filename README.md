# my_midway_project

{{description}}

## QuickStart

<!-- add docs here for user -->

see [midway docs][midway] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.


[midway]: https://midwayjs.org


## Redis 划分
借助 jwt 插件做签名校验，用户的 token 中会包含 id 字段。

### 所有 admin 相关的缓存数据都放在 `admin:xxxx` 下面

- `admin:accessToken:${id}` 缓存管理员用户 Token 信息
- `admin:userinfo:${id}` 缓存管理员基本信息

## TODO

- 基础
- - [x] Admin登录
- - [ ] 普通用户登录-账户密码
- - [ ] OAuth 2.0
- - [ ] 日志监控
- - [ ] 本地上传文件服务
- - [x] 鉴权中间件
- - [ ] 接口响应统计中间件

- 超级管理
- - [ ] 权限
- - [ ] 角色
- - [ ] 用户(管理员)
- - [ ] 菜单
- - [ ] 日志

## 迁移API

- home.ts
- - [x] /
- - [x] /ping

- auth.ts
- - [x] /auth/login
- - [x] /auth/logout
- - [x] /auth/currentUser

- admin/menu.ts
- - [x] /admin/menu/query
- - [x] /admin/menu/show
- - [ ] /admin/menu/create
- - [ ] /admin/menu/update
- - [ ] /admin/menu/remove
- - [ ] /admin/menu/order

- admin/permission.ts
- - [x] /admin/permission/query
- - [ ] /admin/permission/show
- - [ ] /admin/permission/create
- - [ ] /admin/permission/update
- - [ ] /admin/permission/remove

- admin/role.ts
- - [x] /admin/role/query
- - [ ] /admin/role/show
- - [ ] /admin/role/create
- - [ ] /admin/role/update
- - [ ] /admin/role/remove

- admin/user.ts
- - [x] /admin/user/query
- - [ ] /admin/user/show
- - [ ] /admin/user/create
- - [ ] /admin/user/update
- - [ ] /admin/user/remove