/* eslint-disable no-console */
import { Application } from 'egg';

// https://eggjs.org/zh-cn/advanced/loader.html
export default class AppBootHook {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad(): void {
    console.log('🚀 Your APP is launching...');
  }

  // Config, plugin files have been loaded.
  configDidLoad(): void {
    // 增加全局错误处理中间件
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.app.config.coreMiddleware.unshift('errorHandlerMiddleware');
  }

  async serverDidReady(): Promise<void> {
    // Server is listening.
    console.log('✅ Your awesome APP launched');
  }
}
