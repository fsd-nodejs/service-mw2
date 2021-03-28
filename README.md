# FSD Service
<p align="center">
  <a href="https://github.com/fsd-nodejs" target="blank"><img src="https://user-images.githubusercontent.com/10667077/112448489-69363f00-8d8d-11eb-8ead-948b0d3aa897.png" width="300" alt="FSD Logo" /></a>
</p>
<p align="center"> FSD (Full Stack Develop) Service - <a href="https://github.com/midwayjs/midway" target="_blank">Midway.js</a> 的最佳实践</p>
<p align="center">
  <a href="https://codecov.io/gh/fsd-nodejs/service-mw2" target="_blank"><img src="https://codecov.io/gh/fsd-nodejs/service-mw2/branch/master/graph/badge.svg" alt="codecov" /></a>
  <a href="https://github.com/fsd-nodejs/service-mw2" target="_blank"><img src="https://github.com/fsd-nodejs/service-mw2/workflows/Node.js%20CI/badge.svg" alt="GitHub Actions status" /></a>
<a href="https://app.fossa.com/projects/git%2Bgithub.com%2Ffsd-nodejs%2Fservice-mw2?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Ffsd-nodejs%2Fservice-mw2.svg?type=shield"/></a>
  <a href="https://codebeat.co/projects/github-com-fsd-nodejs-service-mw2-master" target="_blank"><img src="https://codebeat.co/badges/ed780b5a-d9e8-41a8-8bc9-8bcb3263c6ce" alt="codebeat badge" /></a>
  <a href="https://app.codacy.com/gh/fsd-nodejs/service-mw2?utm_source=github.com&utm_medium=referral&utm_content=fsd-nodejs/service-mw2&utm_campaign=Badge_Grade_Settings" target="_blank"><img src="https://api.codacy.com/project/badge/Grade/70f1ddd7463d43eba9039bcb88760038" alt="Codacy Badge" /></a>
  <a href="https://github.com/fsd-nodejs/service-mw2/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" /></a>
  <a href="https://github.com/fsd-nodejs/service-mw2/pulls" target="_blank"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
  <a href="https://sonarcloud.io/dashboard?id=fsd-nodejs_service-mw2" target="_blank"><img src="https://sonarcloud.io/api/project_badges/quality_gate?project=fsd-nodejs_service-mw2" alt="Sonar Cloud" /></a>
</p>

拓展阅读:
- 配套的前端工程请移步 https://github.com/fsd-nodejs/pc 查看这个项目
- 全栈开发文档以及规范 https://github.com/fsd-nodejs/document 查看这个项目
- [midway2.x 深度躺坑记(持续更新)
](https://github.com/fsd-nodejs/service-mw2/wiki/midway2.x-%E6%B7%B1%E5%BA%A6%E8%BA%BA%E5%9D%91%E8%AE%B0(%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0))
- 代码提示 [好玩的代码提示 by waitingsong](https://github.com/fsd-nodejs/service-mw2/pull/32) (考虑到，每个人对于自定义代码提示的要求不一样，就不合并到参考了，这个PR推荐给大家)


## 项目导览 & TODO
在这个项目中，你会看到以下基于 Midway 的实践案例 (上层使用 Egg.js )

我们正在做以下工程实践例子，大家你遇到什么问题，或者希望追加什么功能，或者学习内部实现。
可以关注我们的仓库(点赞，分享...三连)在 issue 留言，我们会征集你的意见，带来最干货的案例。

帮你扫清学习障碍，让你用起 Midway 来更加得心应手，提升能效，找回编码的乐趣。

### 框架特性及能力应用

- [x] 中间件
- [x] 依赖注入
- [x] 参数校验和转换 （DTO 层）
- [x] 测试 （Controller & Service 单元测试）
- [x] Swagger
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

see [Midway docs][Midway] for more detail.

### Development

先将 database 目录下到 sql 文件迁移到数据库，修改默认的config配置文件(需要 Redis 和 MySQL 服务可以正常访问)

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

## 答疑

群里会有热心的朋友，也会有新版本发布推送。钉钉扫码加入答疑群


二群

![](https://img.alicdn.com/imgextra/i2/O1CN01SRJO0P1YaqxhtPU2X_!!6000000003076-2-tps-305-391.png)


一群（已满）

![](https://img.alicdn.com/imgextra/i2/O1CN01ofEEAL2AEpJHbpse5_!!6000000008172-2-tps-311-401.png)

## License
我们的代码使用 [MIT](http://github.com/fsd-nodejs/service-mw2/blob/master/LICENSE) 协议，请放心使用。

<a href="https://app.fossa.com/projects/git%2Bgithub.com%2Ffsd-nodejs%2Fservice-mw2?ref=badge_large" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Ffsd-nodejs%2Fservice-mw2.svg?type=large"/></a>
