# FSD service

Midway 2.x 样板工程

[![codecov](https://codecov.io/gh/fsd-nodejs/service-mw2/branch/master/graph/badge.svg)](https://codecov.io/gh/fsd-nodejs/service-mw2)
[![GitHub Actions status](https://github.com/fsd-nodejs/service-mw2/workflows/Node.js%20CI/badge.svg)](https://github.com/fsd-nodejs/service-mw2)
[![codebeat badge](https://codebeat.co/badges/ed780b5a-d9e8-41a8-8bc9-8bcb3263c6ce)](https://codebeat.co/projects/github-com-fsd-nodejs-service-mw2-master)

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
- - [ ] 日志(操作日志，记录管理用户的实际操作)

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

## 接口响应统计中间件(设计)
做接口响应数据统计的出发点，有两点
- 帮助排查线上接口响应问题
- 监控系统实时状态

虽然框架本身已经有日志功能，但是很多场景下，我们可能需要看下各个接口服务的响应状态
是在正常服务，还是已经出现问题。在有监控的帮助下，可以快速帮我们定位日志排查问题。
是对应统计实时数据而言，这里我们会使用 RTS 的技术方案，会用到 RabbitMQ 和 Redis 
RabbitMQ 作用在于把统计的计算异步化，从而不影响正常的业务请求处理（消费者的逻辑代码，前期可以和业务代码写在一个工程里面。等业务量上来后，可以考虑拆分出去，独立部署）
大致流程如下，手绘的，工具简陋，姑且看一下。
![IMG_5365 HEIC](https://user-images.githubusercontent.com/10667077/101478900-55a4cb00-398c-11eb-97c3-4a41195c572d.JPG)


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