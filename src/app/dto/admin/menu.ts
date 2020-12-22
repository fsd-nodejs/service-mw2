import { Rule, RuleType } from '@midwayjs/decorator';
import { CreateApiPropertyDoc } from '@midwayjs/swagger';

/**
 * 菜单列表查询参数
 */
export class QueryDTO {
  @CreateApiPropertyDoc('当前页')
  @Rule(RuleType.number().min(1).max(100000).default(1).optional())
  current?: number;

  @CreateApiPropertyDoc('每页数量')
  @Rule(RuleType.number().min(1).max(1000).default(10).optional())
  pageSize?: number;
}

/**
 * 获取单条菜单参数
 */
export class ShowDTO {
  @CreateApiPropertyDoc('菜单id')
  @Rule(RuleType.string().trim().max(10).required())
  id: string;
}

/**
 * 删除菜单参数
 */
export class RemoveDTO {
  @CreateApiPropertyDoc('菜单id数组')
  @Rule(RuleType.array().items(RuleType.string().trim().max(10)).min(1))
  ids: string[];
}

/**
 * 创建菜单参数
 */
export class CreateDTO {
  @CreateApiPropertyDoc('父级菜单的id')
  @Rule(RuleType.string().trim().max(10).optional().default('0'))
  parentId?: string;

  @CreateApiPropertyDoc('标题')
  @Rule(RuleType.string().trim().max(50).required())
  title: string;

  @CreateApiPropertyDoc('路由地址(前端使用的)')
  @Rule(
    RuleType.string().trim().max(255).uri({ allowRelative: true }).required()
  )
  uri: string;

  @CreateApiPropertyDoc('关联的角色')
  @Rule(RuleType.array().items(RuleType.string().trim().max(10)).optional())
  roles?: string[];

  @CreateApiPropertyDoc('关联的权限')
  @Rule(RuleType.string().trim().max(10).optional())
  permissionId?: string;
}

/**
 * 更新菜单参数
 */
export class UpdateDTO {
  @CreateApiPropertyDoc('菜单的id')
  @Rule(RuleType.string().trim().max(10).required())
  id: string;

  @CreateApiPropertyDoc('父级菜单的id')
  @Rule(RuleType.string().trim().max(10).optional().default('0'))
  parentId?: string;

  @CreateApiPropertyDoc('标题')
  @Rule(RuleType.string().trim().max(50).optional())
  title?: string;

  @CreateApiPropertyDoc('路由地址(前端使用的)')
  @Rule(
    RuleType.string().trim().max(255).uri({ allowRelative: true }).optional()
  )
  uri?: string;

  @CreateApiPropertyDoc('关联的角色')
  @Rule(RuleType.array().items(RuleType.string().trim().max(10).optional()))
  roles?: string[];

  @CreateApiPropertyDoc('关联的权限')
  @Rule(RuleType.string().trim().max(10).optional())
  permissionId?: string;
}

/**
 * 菜单排序参数
 */
export class OrderMenuDTO {
  @CreateApiPropertyDoc('对菜单进行排序对数组，每个object 都需要 id parentId')
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
