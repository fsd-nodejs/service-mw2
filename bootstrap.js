// 如果使用PM2启动这个项目，可以只需 `NODE_ENV=production node bootstrap.js`
// 获取框架
// eslint-disable-next-line import/order
const WebFramework = require('@midwayjs/web').Framework;
// 初始化 web 框架并传入启动参数
const web = new WebFramework().configure({
  port: 9000,
  hostname: '0.0.0.0',
});

const { Bootstrap } = require('@midwayjs/bootstrap');

// 加载框架并执行
Bootstrap.load(web).run();
