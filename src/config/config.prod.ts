import { TracerConfig, defaultTracerConfig } from '@mw-components/jaeger';

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
