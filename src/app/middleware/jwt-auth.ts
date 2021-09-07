import * as assert from 'assert';

import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, MidwayWebMiddleware } from '@midwayjs/web';

import { IMidwayWebNext, Context } from '../../interface';
import MyError from '../util/my-error';

@Provide()
export class JwtAuth implements IWebMiddleware {
  resolve(): MidwayWebMiddleware {
    return authMiddleware;
  }
}

async function authMiddleware(
  ctx: Context,
  next: IMidwayWebNext
): Promise<void> {
  if (!ctx.currentUser) {
    ctx.currentUser = {};
  }

  if (ctx.jwtState.user) {
    const { user } = ctx.jwtState;
    const { jwtAuth } = ctx.app.config;

    // redisToken不存在表示token已过期
    const redisToken = await ctx.app.redis.get(
      `${jwtAuth.redisScope}:accessToken:${user.id}`
    );

    const [, token] = ctx.header.authorization.split(' ');
    // 验证是否为最新的token
    assert.ok(token === redisToken, new MyError('Authentication Failed', 401));

    const userinfo = await ctx.app.redis.get(
      `${jwtAuth.redisScope}:userinfo:${user.id}`
    );

    ctx.currentUser = JSON.parse(userinfo);
  }

  return next();
}
