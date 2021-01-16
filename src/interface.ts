import type { Koid } from 'egg-koid';

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

declare module 'egg' {
  interface Application {
    koid: Koid;
  }
  interface Context {
    reqId: string;
  }
}
