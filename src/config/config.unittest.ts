import { EggRedisOptions } from 'egg-redis';

export const security = {
  csrf: false,
};

// 数据库配置
export const orm = {
  type: 'mysql',
  host: '192.168.12.130',
  port: 3306,
  username: 'homestead',
  password: 'secret',
  database: 'shop_development',
  synchronize: false,
  logging: false,
};

// redis配置
export const redis: EggRedisOptions = {
  client: {
    port: 6379, // Redis port
    host: '192.168.12.130', // Redis host
    password: '',
    db: 0,
  },
};

export const logger = {
  // disableConsoleAfterReady: 'true',
};
