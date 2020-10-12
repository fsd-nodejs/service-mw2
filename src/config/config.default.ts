import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { JwtConfig } from '@waiting/egg-jwt';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602294995416_4568';

  // add your config here
  config.middleware = ['jwtAuth'];

  // 数据库配置
  config.orm = {
    type: 'mysql',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_HOST || 3306,
    username: process.env.MYSQL_USER || '',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || undefined,
    synchronize: false,
    logging: false,
    timezone: '+08:00',
  };

  // redis配置
  config.redis = {
    client: {
      port: +process.env.REDIS_PORT || 6379, // Redis port
      host: process.env.REDIS_HOST || '127.0.0.1', // Redis host
      password: process.env.REDIS_PASSWORD || '',
      db: +process.env.REDIS_DB || 0,
    },
  };

  // jwt配置
  config.jwt = {
    enable: true,
    client: {
      secret: '123456',
    },
    ignore: ['/auth/login', '/ping'],
  } as JwtConfig;

  // jwt token 校验中间件
  config.jwtAuth = {
    enable: true,
    ignore: ['/auth/login', '/ping'],
  };

  config.admin = {
    accessTokenExpiresIn: 60 * 60 * 24 * 3, // 签名过期时间也可写
  };

  return config;
};
