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
    _internalError?: Error;
  }
  // interface IHelper {
  //   /**
  //    * 密文转hash
  //    * @function Helper#bhash
  //    * @param {String} str 需要加密的内容
  //    * @returns {String} 密文
  //    */
  //   bhash: (str: string) => string;

  //   /**
  //    * hash是否正确
  //    * @param {String} str 需要匹配的内容
  //    * @param {String} hash hash值
  //    * @returns {Boolean} 是否匹配
  //    */
  //   bcompare: (str: string, hash: string) => boolean;

  //   /**
  //    * 对比两个数组差异
  //    * @function Helper#arrayDiff
  //    * @param {(string | number)[]} arrA 数组A
  //    * @param {(string | number)[]} arrB 数组B
  //    * @returns {[increase:  (string | number)[], decrease:  (string | number)[]]} [increase, decrease]
  //    */
  //   arrayDiff: (
  //     arrA: (string | number)[],
  //     arrB: (string | number)[]
  //   ) => [increase: (string | number)[], decrease: (string | number)[]];
  //   /**
  //    * 处理成功响应
  //    * @function Helper#success
  //    * @param {any} result Return data, Default null
  //    * @param {String} message Error message, Default '请求成功'
  //    * @param {Number} status Status code, Default '200'
  //    *
  //    * @example
  //    * ```js
  //    * ctx.helper.success({}, null, 201);
  //    * ```
  //    */
  //   success: (
  //     result?: any,
  //     message?: string,
  //     status?: 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207
  //   ) => void;
  // }
}
