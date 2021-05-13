import { Provide } from '@midwayjs/decorator';
import {
  IWebMiddleware,
  IMidwayWebNext,
  MidwayWebMiddleware,
} from '@midwayjs/web';
import { Context } from 'egg';
import { globalTracer, Tags, FORMAT_HTTP_HEADERS } from 'opentracing';

import { TracerConfig } from '../../config/config.types';
import { TracerLog, TracerTag } from '../../config/tracer.config';
import { retrieveExternalNetWorkInfo } from '../util/common';
import { SpanLogInput, TracerManager } from '../util/tracer';

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
  if (pathMatched(ctx.path, ctx.app.config.tracer.whiteList)) {
    ctx.tracerManager = new TracerManager(false);
    return next();
  }
  startSpan(ctx);
  // 设置异常链路一定会采样
  ctx.res.once('finish', () => finishSpan(ctx));

  return next();
}

function startSpan(ctx: Context): void {
  // 开启第一个span并入栈
  const tracerManager = new TracerManager(true);
  const requestSpanCtx =
    globalTracer().extract(FORMAT_HTTP_HEADERS, ctx.headers) ?? undefined;

  tracerManager.startSpan(ctx.path, requestSpanCtx);
  tracerManager.setSpanTag(Tags.HTTP_METHOD, ctx.req.method ?? 'n/a');
  ctx.reqId && tracerManager.setSpanTag(TracerTag.reqId, ctx.reqId);

  const { pkgJson } = ctx.app.config;
  tracerManager.setSpanTag(TracerTag.svcName, pkgJson.name);
  if (pkgJson.version) {
    tracerManager.setSpanTag(TracerTag.svcVer, pkgJson.version);
  }

  retrieveExternalNetWorkInfo().forEach(ipInfo => {
    if (ipInfo.family === 'IPv4') {
      tracerManager.setSpanTag(TracerTag.svcIp4, ipInfo.cidr);
    }
    // else {
    //   tracerManager.setSpanTag(TracerTag.svcIp6, ipInfo.cidr)
    // }
  });

  tracerManager.setSpanTag(Tags.PEER_HOST_IPV4, ctx.request.ip);
  tracerManager.spanLog({ event: TracerLog.requestBegin });

  ctx.tracerManager = tracerManager;
}

function finishSpan(ctx: Context) {
  const { tracerManager } = ctx;
  const { status } = ctx.response;

  if (status >= 400) {
    tracerManager.setSpanTag(Tags.SAMPLING_PRIORITY, 1);
    tracerManager.setSpanTag(Tags.ERROR, true);
    setLogForCustomCode(ctx, tracerManager);
  } else {
    const opts: ProcessPriorityOpts = {
      starttime: ctx.starttime,
      trm: tracerManager,
      tracerConfig: ctx.app.config.tracer,
    };
    processPriority(opts);
  }

  tracerManager.setSpanTag(Tags.HTTP_STATUS_CODE, status);
  tracerManager.spanLog({ event: TracerLog.requestEnd });
  tracerManager.finishSpan();
}

export interface ProcessPriorityOpts {
  starttime: number;
  trm: TracerManager;
  tracerConfig: TracerConfig;
}
function processPriority(options: ProcessPriorityOpts): number | undefined {
  const { starttime, trm } = options;
  const { reqThrottleMsForPriority: throttleMs } = options.tracerConfig;
  if (throttleMs < 0) {
    return undefined;
  }

  const cost = new Date().getTime() - starttime;
  if (cost >= throttleMs) {
    trm.setSpanTag(Tags.SAMPLING_PRIORITY, 11);
  }
  return cost;
}

function setLogForCustomCode(ctx: Context, trm: TracerManager): void {
  const input: SpanLogInput = {
    event: TracerLog.error,
  };

  // ctx._internalError in error-handler.middleware.ts
  if (ctx._internalError) {
    input[TracerLog.resMsg] = ctx._internalError.message;

    const { stack } = ctx._internalError;
    if (stack) {
      // udp limit 65k
      // @link https://www.jaegertracing.io/docs/1.22/client-libraries/#emsgsize-and-udp-buffer-limits
      input[TracerLog.errStack] = stack.slice(0, 50000);
    }
  }

  trm.spanLog(input);
}

function pathMatched(path: string, rules: TracerConfig['whiteList']): boolean {
  return rules.some(rule => {
    if (!rule) {
      return;
    } else if (typeof rule === 'string') {
      return rule === path;
    } else {
      return rule.test(path);
    }
  });
}
