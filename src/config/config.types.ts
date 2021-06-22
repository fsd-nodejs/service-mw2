import { Jwt, JwtEggConfig } from '@waiting/egg-jwt';
import { NpmPkg } from '@waiting/shared-types';
import { EggAppConfig, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

/** JwtAuthMiddleware */
export interface JwtAuthMiddlewareConfig {
  /** 签名过期时间也可写 */
  accessTokenExpiresIn: number;
  ignore: JwtEggConfig['ignore'];
  /** redis的作用域前缀 */
  redisScope: string;
}

export interface RabbitmqConfig {
  /** mq 地址 */
  url: string;
}

declare module 'egg' {
  /**
   * 增加挂载在 ctx.app.xxx 上的对象 TS 申明
   */
  interface Application {
    jwt: Jwt;
  }

  /**
   * config 配置文件的 TS 声明
   */
  interface EggAppConfig {
    admin: Record<string, string>;
    coreMiddleware: string[];
    jwt: JwtEggConfig;
    jwtAuth: JwtAuthMiddlewareConfig;
    pkgJson: NpmPkg;
    rabbitmq: RabbitmqConfig;
  }
}
