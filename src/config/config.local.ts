import { EggRedisOptions } from 'egg-redis';
// redis配置
export const redis: EggRedisOptions = {
  client: {
    port: 6379, // Redis port
    host: '192.168.12.130', // Redis host
    password: '',
    db: 0,
  },
};
