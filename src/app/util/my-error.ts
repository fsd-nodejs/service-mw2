/**
 * 全局自定义错误结构
 * 可以接受多条错误信息，用于业务抛错
 */
export default class MyError extends Error {
  status: number;
  errors: any[] | undefined;

  constructor(message: string, status?: number, errors?: any[]) {
    super(message + ` &>${status || ''}`); // 兼容ci测试时，assert无法自定义增加status
    this.status = typeof status === 'number' ? status : 0;
    this.errors = errors;
  }
}
