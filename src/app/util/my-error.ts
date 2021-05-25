export default class MyError extends Error {
  status: number;
  errors: any[] | undefined;
  details?: unknown;

  /**
   * 全局自定义错误结构
   * 可以接受多条错误信息，用于业务抛错
   * @param message 错误信息
   * @param status 状态码。不填写默认500，错误一般为 4xx, 5xx
   * @param errors 错误数组(jio 表单错误多条)
   */
  constructor(message: string, status?: number, errors?: any[]) {
    super(message + ` &>${status || ''}`); // 兼容ci测试时，assert无法自定义增加status
    this.status = typeof status === 'number' ? status : 0;
    this.errors = errors;
  }
}
