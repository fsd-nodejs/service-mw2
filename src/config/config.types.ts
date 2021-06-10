import { Jwt, JwtEggConfig } from '@waiting/egg-jwt';
import { NpmPkg } from '@waiting/shared-types';
import { EggAppConfig, PowerPartial } from 'egg';
import { KoidEggConfig } from 'egg-koid';

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
