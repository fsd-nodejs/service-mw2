import { TracerConfig, defaultTracerConfig } from '@mw-components/jaeger';
import {
  JwtConfig,
  JwtMiddlewareConfig,
  initialJwtMiddlewareConfig,
} from '@mw-components/jwt';

import { JwtAuthMiddlewareConfig } from './config.types';

// jwt配置
export const jwtConfig: JwtConfig = {
  secret: '', // 默认密钥，生产环境一定要更改!
};
export const jwtMiddlewareConfig: JwtMiddlewareConfig = {
  ...initialJwtMiddlewareConfig,
  ignore: ['/auth/login', '/ping', '/genid', '/genidHex', /\/swagger-u.*/u],
};
// jwt token 校验中间件(需配合jwt使用, ignore的配置与jwt一致)
export const jwtAuth: JwtAuthMiddlewareConfig = {
  ignore: jwtMiddlewareConfig.ignore,
  redisScope: 'admin', // redis的作用域前缀
  accessTokenExpiresIn: 60 * 60 * 24 * 3, // 签名过期时间也可写
};

export const tracer: TracerConfig = {
  ...defaultTracerConfig,
  reqThrottleMsForPriority: 1000,
  whiteList: ['/favicon.ico', '/favicon.png', '/ping', '/metrics'],
  tracingConfig: {
    sampler: {
      type: 'probabilistic',
      param: 0.0001,
    },
    reporter: {
      agentHost: '127.0.0.1',
    },
  },
};
