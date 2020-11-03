import { EggRedisOptions } from 'egg-redis';

export const security = {
  csrf: false,
};

// 数据库配置
export const orm = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || '192.168.12.130',
  port: process.env.MYSQL_HOST || 3306,
  username: process.env.MYSQL_USER || 'homestead',
  password: process.env.MYSQL_PASSWORD || 'secret',
  database: process.env.MYSQL_DATABASE || 'shop_development',
  synchronize: false,
  logging: false,
};

// redis配置
export const redis: EggRedisOptions = {
  client: {
    port: +process.env.REDIS_PORT || 6379, // Redis port
    host: process.env.REDIS_HOST || '192.168.12.130', // Redis host
    password: process.env.REDIS_PASSWORD || '',
    db: +process.env.REDIS_DB || 0,
  },
};

export const logger = {
  disableConsoleAfterReady: 'true',
};
