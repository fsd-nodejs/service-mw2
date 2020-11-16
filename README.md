# FSD service

Midway 2.x 样板工程

[![codecov](https://codecov.io/gh/fsd-nodejs/service-mw2/branch/master/graph/badge.svg)](https://codecov.io/gh/fsd-nodejs/service-mw2)
[![GitHub Actions status](https://github.com/fsd-nodejs/service-mw2/workflows/Node.js%20CI/badge.svg)](https://github.com/fsd-nodejs/service-mw2)
[![codebeat badge](https://codebeat.co/badges/ed780b5a-d9e8-41a8-8bc9-8bcb3263c6ce)](https://codebeat.co/projects/github-com-fsd-nodejs-service-mw2-master)

## QuickStart

<!-- add docs here for user -->

see [midway docs][midway] for more detail.

### Development

先将database目录下到sql文件迁移到数据库，修改默认的config配置文件

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
借助 jwt 插件做签名校验，管理员的 token 中会包含 id 字段。

### 所有 admin 相关的缓存数据都放在 `admin:xxxx` 下面

- `admin:accessToken:${id}` 缓存管理员 Token 信息
- `admin:userinfo:${id}` 缓存管理员基本信息

## 数据库设计(目前基础模块不使用软删除)
所有实体表均有deleted_at字段，用于软删除。如果要关闭软删除，将deletedAt字段注释即可

进行软删除的时候，关系表的数据不做改动。

后期根据需要，用脚本定期清理软删除的数据。
- 权限
- 角色
- 菜单
- 管理员

### 查询注意事项(业务软删除单独写一个BaseModel)
- 实体查询，继承`BaseModel`的实体会自带软删除判断，例子查看`src/app/model/base.ts`
- 在做关系查询的时候，关系表需要手动加软删除判断，如下
  ```typescript
    /**
     * 根据菜单id获取数据
     * @param id 菜单id
     */
    async getAdminMenuById(id: string) {
      const row = await this.adminMenuModel
        .createQueryBuilder()
        .select()
        .leftJoinAndSelect(
          'AdminMenuModel.roles',
          'role',
          'role.deletedAt IS NULL'
        )
        .where({ id: id })
        .getOne();
      return row;
    }
  ```

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
- - [x] 权限
- - [x] 角色
- - [x] 管理员
- - [x] 菜单
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
- - [x] /admin/menu/create
- - [x] /admin/menu/update
- - [x] /admin/menu/remove
- - [x] /admin/menu/order

- admin/permission.ts
- - [x] /admin/permission/query
- - [x] /admin/permission/show
- - [x] /admin/permission/create
- - [x] /admin/permission/update
- - [x] /admin/permission/remove

- admin/role.ts
- - [x] /admin/role/query
- - [x] /admin/role/show
- - [x] /admin/role/create
- - [x] /admin/role/update
- - [x] /admin/role/remove

- admin/user.ts
- - [x] /admin/user/query
- - [x] /admin/user/show
- - [x] /admin/user/create
- - [x] /admin/user/update
- - [x] /admin/user/remove