import { Rule, RuleType } from '@midwayjs/decorator';

/**
 * 菜单列表查询参数
 */
export class QueryDTO {
  @Rule(RuleType.number().min(1).max(100000).default(1).optional())
  current?: number;

  @Rule(RuleType.number().min(1).max(1000).default(10).optional())
  pageSize?: number;
}

/**
 * 获取单条菜单参数
 */
export class ShowDTO {
  @Rule(RuleType.string().trim().max(10).required())
  id: string;
}

/**
 * 删除菜单参数
 */
export class RemoveDTO {
  @Rule(RuleType.array().items(RuleType.string().trim().max(10)).min(1))
  ids: string[];
}

/**
 * 创建菜单参数
 */
export class CreateDTO {
  @Rule(RuleType.string().trim().max(10).optional().default('0'))
  parentId: string;

  @Rule(RuleType.string().trim().max(50).required())
  title: string;

  @Rule(
    RuleType.string().trim().max(255).uri({ allowRelative: true }).required()
  )
  uri: string;

  @Rule(RuleType.array().items(RuleType.string().trim().max(10)).optional())
  roles: string[];

  @Rule(RuleType.string().trim().max(10).optional())
  permissionId: string;
}

/**
 * 更新菜单参数
 */
export class UpdateDTO {
  @Rule(RuleType.string().trim().max(10).required())
  id: string;

  @Rule(RuleType.string().trim().max(10).optional().default('0'))
  parentId: string;

  @Rule(RuleType.string().trim().max(50).optional())
  title: string;

  @Rule(
    RuleType.string().trim().max(255).uri({ allowRelative: true }).optional()
  )
  uri: string;

  @Rule(RuleType.array().items(RuleType.string().trim().max(10).optional()))
  roles: string[];

  @Rule(RuleType.string().trim().max(10).optional())
  permissionId: string;
}

/**
 * 菜单排序参数
 */
export class OrderMenuDTO {
  @Rule(
    RuleType.array()
      .items(
        RuleType.object({
          id: RuleType.string().trim().max(10).required(),
          parentId: RuleType.string().trim().max(10).optional().default('0'),
        })
      )
      .min(1)
      .required()
  )
  orders: {
    id: string;
    parentId: string;
  }[];
}
