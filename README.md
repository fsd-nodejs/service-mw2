# FSD service

如果该项目对你有用，欢迎 star 👏

Midway 2.x 样板工程

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/70f1ddd7463d43eba9039bcb88760038)](https://app.codacy.com/gh/fsd-nodejs/service-mw2?utm_source=github.com&utm_medium=referral&utm_content=fsd-nodejs/service-mw2&utm_campaign=Badge_Grade_Settings)
[![codecov](https://codecov.io/gh/fsd-nodejs/service-mw2/branch/master/graph/badge.svg)](https://codecov.io/gh/fsd-nodejs/service-mw2)
[![GitHub Actions status](https://github.com/fsd-nodejs/service-mw2/workflows/Node.js%20CI/badge.svg)](https://github.com/fsd-nodejs/service-mw2)
[![codebeat badge](https://codebeat.co/badges/ed780b5a-d9e8-41a8-8bc9-8bcb3263c6ce)](https://codebeat.co/projects/github-com-fsd-nodejs-service-mw2-master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/fsd-nodejs/service-mw2/pulls)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/fsd-nodejs/service-mw2/blob/master/LICENSE)

拓展阅读:
- 配套的前端工程请移步 https://github.com/fsd-nodejs/pc 查看这个项目
- 全栈开发文档以及规范 https://github.com/fsd-nodejs/document 查看这个项目
- [midway2.x 深度躺坑记(持续更新)
](https://github.com/fsd-nodejs/service-mw2/wiki/midway2.x-%E6%B7%B1%E5%BA%A6%E8%BA%BA%E5%9D%91%E8%AE%B0(%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0))
- 代码提示 [好玩的代码提示 by waitingsong](https://github.com/fsd-nodejs/service-mw2/pull/32) (考虑到，每个人对于自定义代码提示的要求不一样，就不合并到参考了，这个PR推荐给大家)

## 项目导览 & TODO
在这个项目中，你会看到以下基于 midway 的实践案例 (上层使用 eggjs )

我们正在做以下工程例子，如果你有新的想法，可在 issue 留言，我们会征集你的意见，带来最干货的案例。

帮你扫清学习障碍，让你用起 midway 来更加得心应手，提升能效，找回编码的乐趣。

### 框架特性及能力应用

- [x] 中间件
- [x] 依赖注入
- [x] 参数校验和转换 （DTO 层）
- [x] 测试 （Controller & Service 单元测试）
- [x] swagger
- [x] Database



### 功能

>**基础**

- [x] Admin 登录
- [ ] 普通用户登录-账户密码
- [ ] OAuth 2.0
- [ ] 日志监控
- [ ] 本地上传文件服务
- [x] 鉴权中间件
- [ ] 接口响应统计中间件
- [x] 统一错误处理
- [x] SnowFlake 雪花算法生成分布式ID 



>**超级管理**
- [x] 权限
- [x] 角色
- [x] 管理员
- [x] 菜单
- [ ] 日志(操作日志，记录管理用户的实际操作)


## 快速开始

<!-- add docs here for user -->

see [midway docs][midway] for more detail.

### Development

先将 database 目录下到 sql 文件迁移到数据库，修改默认的config配置文件

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


## Redis
- 使用 Redis 作为用户登录凭证存取的地方
- RTS 收集统计数据 (开发中)

### Redis划分

建议使用 Redis 的时候，对所有 key 做好命名空间划分，便于管理。可把 scope 写到对照表中。

借助 jwt 插件做签名校验，管理员的 token 中会包含 id 字段。

 所有 admin 相关的缓存数据都放在 `admin:xxxx` 下面。

- `admin:accessToken:${id}` 缓存管理员 Token 信息
- `admin:userinfo:${id}` 缓存管理员基本信息

## 数据库
所有实体表均有 deleted_at 字段(目前基础模块不使用软删除)，用于软删除。

如果要关闭软删除，将deletedAt字段注释即可

进行软删除的时候，关系表的数据不做改动。

后期根据需要，用脚本定期清理软删除的数据。



以下模块未使用软删除：

- 权限管理
- 角色管理
- 菜单管理
- 管理员管理

### 查询注意事项

业务软删除单独写一个 BaseModel，其他实体继承该 Model 即可

- 实体查询，继承 `BaseModel` 的实体会自带软删除判断，例子查看`src/app/model/base.ts`
- 在做关系查询的时候，关系表需要手动加软删除判断 IS NULL，如下:
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

做接口响应数据统计的出发点，有两点（即使有类似的第三方包，但还是自己实现以下）:
- 帮助排查线上接口响应问题
- 监控系统实时状态

虽然框架本身已经有日志功能，但是很多场景下，我们可能需要看下各个接口服务的响应状态

是在正常服务，还是已经出现问题。在有监控的帮助下，可以快速帮我们定位日志排查问题。

是对应统计实时数据而言，这里我们会使用 RTS 的技术方案，会用到 RabbitMQ 和 Redis 

RabbitMQ 作用在于把统计的计算异步化，从而不影响正常的业务请求处理

（消费者的逻辑代码，需要写在单独一个工程，独立部署）

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
