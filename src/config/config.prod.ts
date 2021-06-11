import { TracerConfig, defaultTracerConfig } from 'midway-component-jaeger';

export const tracer: TracerConfig = {
  ...defaultTracerConfig,
  reqThrottleMsForPriority: 200,
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
