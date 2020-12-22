// eslint-disable-next-line node/no-unpublished-import
import 'tsconfig-paths/register';

import { Configuration, App } from '@midwayjs/decorator';
import * as swagger from '@midwayjs/swagger';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';

@Configuration({
  imports: [
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

  // 启动前处理
  async onReady(): Promise<void> {}

  // 可以在这里做些停止后处理
  // async onStop(): Promise<void> {}
}
