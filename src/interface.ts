/* eslint-disable import/no-extraneous-dependencies */
import {
  IMidwayWebApplication as Application,
  IMidwayWebContext as Context,
  IMidwayWebNext,
} from '@midwayjs/web';
import { JwtState } from '@mw-components/jwt';

export { Application, Context, IMidwayWebNext };

export { IMidwayContainer } from '@midwayjs/core';

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

export { TracerLog } from '@mw-components/jaeger';
export { NpmPkg } from '@waiting/shared-types';

declare module '@midwayjs/core' {
  interface Context {
    reqId: string;
    _internalError?: Error;
    jwtState: JwtState<JwtUser>;
  }
}

export interface JwtUser {
  id: string;
}
