import { Provide } from '@midwayjs/decorator';
import {
  IWebMiddleware,
  IMidwayWebNext,
  MidwayWebMiddleware,
} from '@midwayjs/web';
import { HeadersKey } from '@mw-components/jaeger';
import { KoidComponent } from '@mw-components/koid';

import { Context } from '@/interface';

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
  const key = HeadersKey.reqId;
  let reqId = ctx.get(key);

  if (reqId) {
    ctx.reqId = reqId;
  } else {
    const koid = await ctx.requestContext.getAsync(KoidComponent);
    reqId = koid.idGenerator.toString();
    ctx.reqId = reqId;
  }

  ctx.set(key, reqId);

  await next();
}
