import * as assert from 'assert';

import { IMidwayWebNext } from '@midwayjs/web';

import MyError from '@/app/util/my-error';

// jwt auth
export default () => {
  return async (ctx, next: IMidwayWebNext) => {
    const [, token] = ctx.header.authorization.split(' ');

    try {
      // 解密，获取payload
      const { payload } = ctx.app.jwt.decode(token);

      // redisToken不存在表示token已过期
      const redisToken = await ctx.app.redis.get(
        `admin:accessToken:${payload.id}`
      );

      // 验证是否为最新的token
      assert(token === redisToken, new MyError('Authentication Failed', 401));

      ctx.currentUser = payload;
    } catch (error) {
      // console.log(error.status)
      ctx.throw(error);
    }

    await next();
  };
};
