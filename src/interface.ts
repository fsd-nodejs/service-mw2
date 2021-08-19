import { JwtState } from '@mw-components/jwt';

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

export { TracerLog } from '@mw-components/jaeger';
export {
  IMidwayWebApplication as Application,
  IMidwayWebContext as Context,
} from '@midwayjs/web';

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
