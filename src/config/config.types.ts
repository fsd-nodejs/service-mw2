import { Jwt, JwtEggConfig } from '@waiting/egg-jwt';
import { NpmPkg } from '@waiting/shared-types';
import { EggAppConfig, PowerPartial } from 'egg';
import { KoidEggConfig } from 'egg-koid';
import { TracingConfig } from 'jaeger-client';

import type { TracerManager } from '../app/util/tracer';

export interface DefaultConfig extends PowerPartial<EggAppConfig> {
  jwt: JwtEggConfig;
  jwtAuth: JwtAuthMiddlewareConfig;
  koid: KoidEggConfig;
}

/** JwtAuthMiddleware */
export interface JwtAuthMiddlewareConfig {
  /** 签名过期时间也可写 */
  accessTokenExpiresIn: number;
  ignore: JwtEggConfig['ignore'];
  /** redis的作用域前缀 */
  redisScope: string;
}

declare module 'egg' {
  interface Application {
    jwt: Jwt;
  }

  interface Context {
    tracerManager: TracerManager;
  }

  interface EggAppConfig {
    coreMiddleware: string[];
    jwt: JwtEggConfig;
    jwtAuth: JwtAuthMiddlewareConfig;
    pkgJson: NpmPkg;
    tracer: TracerConfig;
  }
}

export interface TracerConfig {
  /** 忽略名单 */
  whiteList: string[];
  /**
   * 采样请求处理时间（毫秒）阈值
   * 负数不采样
   */
  reqThrottleMsForPriority: number;
  tracingConfig: TracingConfig;
}
