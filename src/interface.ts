/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

// declare module 'egg' {
//   interface Context {
//     reqId: string;
//     _internalError?: Error;
//   }
// }
declare module '@midwayjs/core' {
  interface Context {
    reqId: string;
    _internalError?: Error;
  }
}

export { TracerLog } from '@mw-components/jaeger';
export {
  IMidwayWebApplication as Application,
  IMidwayWebContext as Context,
} from '@midwayjs/web';
