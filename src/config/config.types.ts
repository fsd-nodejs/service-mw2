import { Jwt, JwtEggConfig } from '@waiting/egg-jwt';
import { EggAppConfig, PowerPartial } from 'egg';
import { KoidEggConfig } from 'egg-koid';
import type { TracerManager } from '../app/util/tracer'

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
    tracerManager: TracerManager
  }

  interface EggAppConfig {
    jwt: JwtEggConfig;
    jwtAuth: JwtAuthMiddlewareConfig;
  }
}
