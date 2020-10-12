/**
 * 全局自定义错误结构
 * 可以接受多条错误信息，用于业务抛错
 */
export default class MyError extends Error {
  status: number;
  errors: any[] | undefined;

  constructor(message: string, status: number, errors?: any[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
