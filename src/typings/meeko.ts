declare module 'meeko' {
  interface ArrayFunctions {
    /**
     * 取得交集
     * @param {(string | number)[]} arg0 数组0
     * @param {(string | number)[]} arg1 数组1
     * @returns {(string | number)[]} 交集
     */
    intersect: (
      arg0: (string | number)[],
      arg1: (string | number)[]
    ) => (string | number)[];

    /**
     * 取得差集
     * @param {(string | number)[]} arg0 数组0
     * @param {(string | number)[]} arg1 数组1
     * @returns {(string | number)[]} 差集
     */
    except: (
      arg0: (string | number)[],
      arg1: (string | number)[]
    ) => (string | number)[];
  }
  // 在此只是简单地进行类型描述
  export const array: ArrayFunctions;
}
