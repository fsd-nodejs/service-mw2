import { Application } from 'egg';

export default (app: Application) => {
  // 增加全局错误处理中间件
  app.config.appMiddleware.unshift('errorHandler');
};
