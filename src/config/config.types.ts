import { Jwt, JwtConfig } from '@waiting/egg-jwt';
import { EggAppConfig, PowerPartial } from 'egg';
import { KoidEggConfig } from 'egg-koid';

export interface DefaultConfig extends PowerPartial<EggAppConfig> {
  jwt: JwtConfig;
  jwtAuth: JwtAuthMiddlewareConfig;
  koid: KoidEggConfig;
}

/** JwtAuthMiddleware */
export interface JwtAuthMiddlewareConfig {
  /** 签名过期时间也可写 */
  accessTokenExpiresIn: number;
  ignore: JwtConfig['ignore'];
  /** redis的作用域前缀 */
  redisScope: string;
}

declare module 'egg' {
  interface Application {
    jwt: Jwt;
  }

  interface EggAppConfig {
    jwt: JwtConfig;
    jwtAuth: JwtAuthMiddlewareConfig;
  }
}
