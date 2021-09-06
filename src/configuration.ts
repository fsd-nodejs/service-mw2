/* eslint-disable node/no-extraneous-import */
// eslint-disable-next-line node/no-unpublished-import
import 'tsconfig-paths/register';

import { App, Configuration, Logger } from '@midwayjs/decorator';
import * as swagger from '@midwayjs/swagger';
import { ILifeCycle } from '@midwayjs/core';
import { IMidwayLogger } from '@midwayjs/logger';
import * as jaeger from '@mw-components/jaeger';
import * as jwt from '@mw-components/jwt';
import * as koid from '@mw-components/koid';

import { Application, NpmPkg } from '@/interface';

import { customLogger } from './app/util/custom-logger';

@Configuration({
  imports: [
    jaeger,
    koid,
    jwt,
    '@midwayjs/orm', // 加载 orm 组件
    // 加载swagger组件
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
  ],
})
export class ContainerConfiguration implements ILifeCycle {
  @App()
  app: Application;

  @Logger()
  readonly logger: IMidwayLogger;

  // 启动前处理
  async onReady(): Promise<void> {
    this.app.config.pkgJson = this.app.config.pkg as NpmPkg;

    // 定制化日志
    customLogger(this.logger, this.app);

    // const coreMiddlewareArr = this.app.getConfig('coreMiddleware') as string[]
    const coreMiddlewareArr = this.app.config.coreMiddleware as string[];

    // 增加全局错误处理中间件（确保在最前）
    coreMiddlewareArr.splice(0, 0, 'errorHandlerMiddleware');

    // 增加全局x-request-id处理中间件
    coreMiddlewareArr.splice(1, 0, 'requestIdMiddleware');

    // 需要显式在 app 启动时用 getAsync() 的方式进行触发，否则该类只有在首次被业务逻辑调用的时候才能初始化
    // await this.app.getApplicationContext().getAsync('rabbitmqService');

    const { pkgJson } = this.app.config;
    const info = {
      pkgName: pkgJson.name,
      pkgVersion: pkgJson.version,
    };
    // eslint-disable-next-line no-console
    console.log('✅ Your APP launched', info);
  }

  // 可以在这里做些停止后处理
  // async onStop(): Promise<void> {
  // }
}
