import { Rule, RuleType } from '@midwayjs/decorator';
import { CreateApiPropertyDoc } from '@midwayjs/swagger';

/**
 * 查询角色列表参数
 */
export class QueryDTO {
  @CreateApiPropertyDoc('当前页')
  @Rule(RuleType.number().min(1).max(100000).default(1).optional())
  current?: number;

  @CreateApiPropertyDoc('每页数量')
  @Rule(RuleType.number().min(1).max(1000).default(10).optional())
  pageSize?: number;

  @CreateApiPropertyDoc('筛选字段-id')
  @Rule(RuleType.string().trim().max(10).optional())
  id?: string;

  @CreateApiPropertyDoc('筛选字段-名称')
  @Rule(RuleType.string().trim().max(50).optional())
  name?: string;

  @CreateApiPropertyDoc('筛选字段-标识')
  @Rule(RuleType.string().trim().max(50).optional())
  slug?: string;

  @CreateApiPropertyDoc(
    '排序字段，以字段名加下划线组合，不能有特殊字符和不存在的字段。例如: name_ASC 或者 name_DESC'
  )
  @Rule(
    RuleType.string()
      .trim()
      .max(50)
      .regex(/^[a-zA-Z]*(_ascend|_descend)$/)
      .optional()
  )
  sorter?: string;
}

/**
 * 获取单条角色参数
 */
export class ShowDTO {
  @CreateApiPropertyDoc('角色的id')
  @Rule(RuleType.string().trim().max(10).required())
  id: string;
}

/**
 * 删除角色参数
 */
export class RemoveDTO {
  @CreateApiPropertyDoc('角色id的数组')
  @Rule(RuleType.array().items(RuleType.string().trim().max(10)).min(1))
  ids: string[];
}

/**
 * 创建角色参数
 */
export class CreateDTO {
  @CreateApiPropertyDoc('名称')
  @Rule(RuleType.string().trim().max(50).required())
  name: string;

  @CreateApiPropertyDoc('标识')
  @Rule(RuleType.string().trim().max(50).required())
  slug: string;

  @CreateApiPropertyDoc('关联的权限')
  @Rule(RuleType.array().items(RuleType.string().trim().max(10)).optional())
  permissions?: string[];
}

/**
 * 更新角色参数
 */
export class UpdateDTO {
  @CreateApiPropertyDoc('角色的id')
  @Rule(RuleType.string().trim().max(10).required())
  id: string;

  @CreateApiPropertyDoc('名称')
  @Rule(RuleType.string().trim().max(50).optional())
  name?: string;

  @CreateApiPropertyDoc('标识')
  @Rule(RuleType.string().trim().max(50).optional())
  slug?: string;

  @CreateApiPropertyDoc('关联的权限')
  @Rule(RuleType.array().items(RuleType.string().trim().max(10)).optional())
  permissions?: string[];
}
