// eslint-disable-next-line node/no-unpublished-import
import 'tsconfig-paths/register';

import { Configuration, App } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';

@Configuration({
  imports: [
    '@midwayjs/orm', // 加载 orm 组件
  ],
})
export class ContainerConfiguration implements ILifeCycle {
  @App()
  app: Application;

  async onReady(): Promise<void> {}

  async onStop(): Promise<void> {}
}
