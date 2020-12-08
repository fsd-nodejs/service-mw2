/**
 * 接口请求权限校验
 */
// import * as assert from 'assert';

import { IMidwayWebNext } from '@midwayjs/web';

// import MyError from '../util/my-error';

// check permission
export default () => {
  return async (ctx, next: IMidwayWebNext) => {
    const { url } = ctx.request;
    console.log(url);
    await next();
  };
};
