import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602294995416_4568';

  // add your config here
  config.middleware = [];

  // 所有的路径都走统一错误处理
  config.errorHandler = {
    match: '*',
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
    secret: '123456',
    ignore: ['/auth/login', '/ping'],
  };
  return config;
};
