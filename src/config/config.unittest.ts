import { EggRedisOptions } from 'egg-redis';
import { ConnectionOptions } from 'typeorm';

export const security = {
  csrf: false,
};

// 数据库配置
export const orm: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: +process.env.MYSQL_HOST || 3306,
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
    host: process.env.REDIS_HOST || '127.0.0.1', // Redis host
    password: process.env.REDIS_PASSWORD || '',
    db: +process.env.REDIS_DB || 0,
  },
};

// 建议跑测试的时候设置 true 屏蔽日志(true)，这样手动故意触发的错误，都不会显示处理。设置 false 则输出日志
export const logger = {
  disableConsoleAfterReady: false,
};
