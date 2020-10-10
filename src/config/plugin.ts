import { EggPlugin } from 'egg';
export default {
  static: false, // default is true
} as EggPlugin;

// 启用redis
export const redis = {
  enable: true,
  package: 'egg-redis',
};

export const jwt = {
  enable: true,
  package: '@waiting/egg-jwt',
};
