import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import * as meeko from 'meeko';

moment.locale('zh-cn');

// 基本请求
// interface Response<T = {}> {
//   success: boolean // if request is success
//   data: T // response data
//   code?: number // code for errorType
//   message?: string // message display to user
//   showType?: number // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
//   traceId?: string // Convenient for back-end Troubleshooting: unique request ID
//   host?: string // onvenient for backend Troubleshooting: host of current access server
// }

// 分页
// interface PagingData<T = {}> {
//   current: number
//   pageSize: number
//   total: number
//   list: T[]
// }

module.exports = {
  /**
   * 密文转hash
   * @method Helper#bhash
   * @param {String} str 需要加密的内容
   * @returns {String} 密文
   */
  bhash(str: string) {
    return bcrypt.hashSync(str, 10);
  },
  /**
   * hash是否正确
   * @param {String} str 需要匹配的内容
   * @param {String} hash hash值
   * @returns {Boolean} 是否匹配
   */
  bcompare(str: string, hash: string) {
    return bcrypt.compareSync(str, hash);
  },

  /**
   * 对比两个数组差异
   * @method Helper#arrayDiff
   * @param {(string | number)[]} arrA 数组A
   * @param {(string | number)[]} arrB 数组B
   * @returns {[increase:  (string | number)[], decrease:  (string | number)[]]} [increase, decrease]
   */
  arrayDiff(arrA: any[], arrB: any[]) {
    const intersect = meeko.array.intersect(arrA, arrB);
    const increase = meeko.array.except(arrA, intersect);
    const decrease = meeko.array.except(arrB, intersect);
    return [increase, decrease];
  },
  /**
   * 处理成功响应
   * @method Helper#success
   * @param {any} result Return data, Default null
   * @param {String} message Error message, Default '请求成功'
   * @param {Number} status Status code, Default '200'
   *
   * @example
   * ```js
   * ctx.helper.success({}, null, 201);
   * ```
   */
  success(result = null, message = '请求成功', status = 200) {
    this.ctx.body = {
      code: status,
      message,
      data: result,
    };
    this.ctx.status = status;
  },

  /**
   * 处理失败响应(未使用，暂时注释)
   * @param ctx
   * @param code
   * @param message
   */
  // error(code: number, message: string) {
  //   this.ctx.body = {
  //     code,
  //     message,
  //     data: null,
  //   };
  //   this.ctx.status = code;
  // },
};
