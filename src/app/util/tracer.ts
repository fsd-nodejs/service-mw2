import { Application } from 'egg';
import {
  initTracer as initJaegerTracer,
  JaegerTracer,
  TracingConfig,
} from 'jaeger-client';
import {
  FORMAT_HTTP_HEADERS,
  Span,
  SpanContext,
  initGlobalTracer,
  globalTracer,
} from 'opentracing';

import { TraceHeaderKey } from '../../config/tracer.config';

/**
 * 初始化tracer单例
 * @param app
 */
export function initTracer(app: Application): JaegerTracer {
  const config: TracingConfig = {
    serviceName: app.config.pkgJson.name,
    ...app.config.tracer.tracingConfig,
  };
  const tracer = initJaegerTracer(config, {});
  initGlobalTracer(tracer);
  return tracer;
}

interface SpanHeader {
  [TraceHeaderKey]?: string;
}

/**
 * trace管理类，需初始化并挂载到ctx
 */
export class TracerManager {
  public readonly instanceId = Symbol(new Date().getTime().toString());
  public readonly isTraceEnabled: boolean;

  private readonly spans: Span[];

  constructor(isTraceEnabled: boolean) {
    this.isTraceEnabled = isTraceEnabled;
    this.spans = [];
  }

  currentSpan(): Span | undefined {
    return this.spans[this.spans.length - 1];
  }

  @RunIfEnabled
  startSpan(name: string, parentSpan?: Span | SpanContext): void {
    const span = this.genSpan(name, parentSpan);
    this.spans.push(span);
  }

  private genSpan(name: string, parentSpan?: Span | SpanContext): Span {
    return globalTracer().startSpan(name, {
      childOf: parentSpan ?? this.currentSpan(),
    });
  }

  @RunIfEnabled
  finishSpan(): void {
    this.spans.pop()?.finish();
  }

  @RunIfEnabled
  spanLog(keyValuePairs: SpanLogInput): void {
    this.currentSpan()?.log(keyValuePairs);
  }

  @RunIfEnabled
  setSpanTag(key: string, value: unknown): void {
    this.currentSpan()?.setTag(key, value);
  }

  headerOfCurrentSpan(): SpanHeader {
    if (this.currentSpan()) {
      const currentSpan = this.currentSpan() as Span;
      const header = {};
      globalTracer().inject(currentSpan, FORMAT_HTTP_HEADERS, header);
      return header;
    } else {
      return {};
    }
  }
}

interface TraceMgrPropDescriptor extends PropertyDescriptor {
  isTraceEnabled?: boolean;
}

/**
 * 类方法装饰器
 *  - 链路被启用才执行方法
 * @param _target 目标类
 * @param _propertyKey 函数名
 * @param descriptor 属性描述符
 * @returns
 */
function RunIfEnabled(
  _target: unknown,
  _propertyKey: string,
  descriptor: TraceMgrPropDescriptor
): TraceMgrPropDescriptor {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;
  descriptor.value = function (...args: unknown[]): unknown {
    if (this.isTraceEnabled === true) {
      return originalMethod.apply(this, args);
    }
  };
  return descriptor;
}

export interface SpanLogInput {
  [key: string]: unknown;
}
