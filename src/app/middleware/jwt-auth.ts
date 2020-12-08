/**
 * 用户token的校验，会将当前用户的信息放入ctx.currentUser中
 */
import * as assert from 'assert';

import { IMidwayWebNext } from '@midwayjs/web';

import MyError from '../util/my-error';

// jwt auth
export default () => {
  return async (ctx, next: IMidwayWebNext) => {
    const [, token] = ctx.header.authorization.split(' ');
    // 解密，获取payload
    const { payload } = ctx.app.jwt.decode(token);

    const { jwtAuth } = ctx.app.config;

    // redisToken不存在表示token已过期
    const redisToken = await ctx.app.redis.get(
      `${jwtAuth.redisScope}:accessToken:${payload.id}`
    );

    // 验证是否为最新的token
    assert(token === redisToken, new MyError('Authentication Failed', 401));

    const userinfo = await ctx.app.redis.get(
      `${jwtAuth.redisScope}:userinfo:${payload.id}`
    );

    ctx.currentUser = JSON.parse(userinfo);

    await next();
  };
};
