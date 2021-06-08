import { Jwt, JwtEggConfig } from '@waiting/egg-jwt';
import { NpmPkg } from '@waiting/shared-types';
import { EggAppConfig, PowerPartial } from 'egg';
import { KoidEggConfig } from 'egg-koid';
import { TracingConfig } from 'jaeger-client';

export type DefaultConfig = PowerPartial<EggAppConfig>;

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

  interface EggAppConfig {
    admin: Record<string, string>;
    coreMiddleware: string[];
    jwt: JwtEggConfig;
    jwtAuth: JwtAuthMiddlewareConfig;
    koid: KoidEggConfig;
    pkgJson: NpmPkg;
  }
}

export interface TracerConfig {
  /** 忽略名单 */
  whiteList: (string | RegExp)[];
  /**
   * 强制采样请求处理时间（毫秒）阈值
   * 负数不采样
   */
  reqThrottleMsForPriority: number;
  tracingConfig: TracingConfig;
}
