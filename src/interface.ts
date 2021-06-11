/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

declare module 'egg' {
  interface Context {
    reqId: string;
    _internalError?: Error;
  }
}
