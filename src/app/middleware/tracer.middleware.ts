import { Provide } from '@midwayjs/decorator';
import {
  IWebMiddleware,
  IMidwayWebNext,
  MidwayWebMiddleware,
} from '@midwayjs/web';
import { Context } from 'egg';
import { globalTracer, Tags, FORMAT_HTTP_HEADERS } from 'opentracing';

import { TracerManager } from '../util/tracer';

@Provide()
export class TraceMiddleware implements IWebMiddleware {
  resolve(): MidwayWebMiddleware {
    return traceMiddleware;
  }
}

/**
 * 链路追踪中间件
 * - 对不在白名单内的路由进行追踪
 * - 对异常链路进行上报
 */
async function traceMiddleware(
  ctx: Context,
  next: IMidwayWebNext
): Promise<unknown> {
  // 白名单内的路由不会被追踪
  if (ctx.app.config.tracer.whiteList.includes(ctx.path)) {
    ctx.tracerManager = new TracerManager(false);
    return next();
  }
  // 开启第一个span并入栈
  ctx.tracerManager = new TracerManager(true);
  const requestSpanCtx =
    globalTracer().extract(FORMAT_HTTP_HEADERS, ctx.headers) ?? undefined;
  ctx.tracerManager.startSpan(ctx.path, requestSpanCtx);
  ctx.tracerManager.spanLog({ event: 'request-begin' });
  // 设置异常链路一定会采样
  ctx.res.once('finish', () => finishSpan(ctx));

  return next();
}

function finishSpan(ctx: Context) {
  const { tracerManager } = ctx;
  const { status } = ctx.response;

  if (status >= 400) {
    tracerManager.setSpanTag(Tags.SAMPLING_PRIORITY, 1);
    tracerManager.setSpanTag(Tags.ERROR, true);
    tracerManager.spanLog({
      event: 'error',
      message: ctx.response.message,
      detail: ctx._internalError,
    });
  }

  tracerManager.setSpanTag(Tags.HTTP_STATUS_CODE, status);
  tracerManager.spanLog({ event: 'request-end' });
  tracerManager.finishSpan();
}
