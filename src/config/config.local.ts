import { EggRedisOptions } from 'egg-redis';
import { TracerConfig, defaultTracerConfig } from 'midway-component-jaeger';
import { ConnectionOptions } from 'typeorm';

// 数据库配置
export const orm: ConnectionOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'shop_development',
  synchronize: false,
  logging: true,
};

// redis 配置
export const redis: EggRedisOptions = {
  client: {
    port: 6379, // Redis port
    host: '127.0.0.1', // Redis host
    password: '',
    db: 0,
  },
};

// jaeger 配置 默认访问地址http://localhost:16686/
export const tracer: TracerConfig = {
  ...defaultTracerConfig,
  loggingOutputBody: true,
  reqThrottleMsForPriority: 10,
  tracingConfig: {
    sampler: {
      type: 'probabilistic',
      param: 1,
    },
    reporter: {
      agentHost: '127.0.0.1',
    },
  },
};
