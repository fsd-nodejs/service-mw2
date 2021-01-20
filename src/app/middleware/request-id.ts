import { Provide } from '@midwayjs/decorator';
import {
  IWebMiddleware,
  IMidwayWebNext,
  MidwayWebMiddleware,
} from '@midwayjs/web';
import { Context } from 'egg';

@Provide()
export class RequestIdMiddleware implements IWebMiddleware {
  resolve(): MidwayWebMiddleware {
    return requestIdMiddleware;
  }
}

async function requestIdMiddleware(
  ctx: Context,
  next: IMidwayWebNext
): Promise<void> {
  const key = 'x-request-id';
  let reqId = ctx.get(key);

  if (reqId) {
    ctx.reqId = reqId;
  } else {
    reqId = ctx.app.koid.nextBigint.toString();
    ctx.reqId = reqId;
  }

  ctx.set(key, reqId);

  await next();
}
