import { EggPlugin } from 'egg';

// 启用redis
export const redis = {
  enable: true,
  package: 'egg-redis',
};

// 启用jwt验证
export const jwt = {
  enable: true,
  package: '@waiting/egg-jwt',
};

export const koid = {
  enable: true,
  package: 'egg-koid',
};

export default {
  static: true, // default is true
  redis,
  jwt,
  koid,
} as EggPlugin;
