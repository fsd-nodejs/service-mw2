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