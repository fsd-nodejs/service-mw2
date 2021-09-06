// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line node/no-extraneous-import
import {
  IMidwayLogger,
  MidwayContextLogger,
  MidwayTransformableInfo,
  // eslint-disable-next-line node/no-extraneous-import
} from '@midwayjs/logger';
import { genISO8601String } from '@waiting/shared-core';

import { Application, Context } from '@/interface';

class CustomContextLogger extends MidwayContextLogger<Context> {
  formatContextLabel() {
    const { ctx } = this;
    // format: '[$userId/$ip/$traceId/$use_ms $method $url]'
    const userId = (ctx.userId as string) || '-';
    const traceId = ctx.reqId || '-';
    const use = Date.now() - ctx.startTime;
    const ret =
      userId +
      '/' +
      ctx.ip +
      '/' +
      traceId +
      '/' +
      use.toString() +
      'ms ' +
      ctx.method +
      ' ' +
      ctx.url;

    return ret;
  }
}

export function customLogger(logger: IMidwayLogger, app: Application): void {
  // 格式化日志时间戳
  logger.updateTransformableInfo(updateTransformableInfo);
  // 上下文日志打印请求id
  app.setContextLoggerClass(CustomContextLogger);
}

export function updateTransformableInfo(
  info: MidwayTransformableInfo
): MidwayTransformableInfo {
  const ret = {
    ...info,
    timestamp: genISO8601String(),
  };
  return ret;
}

declare module 'egg' {
  interface Application {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setContextLoggerClass: (BaseContextLoggerClass: any) => void;
  }
}
