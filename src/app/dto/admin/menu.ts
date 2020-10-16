import { Rule, RuleType } from '@midwayjs/decorator';

export class QueryDTO {
  @Rule(RuleType.number().min(1).max(100000).default(1).optional())
  current: number;

  @Rule(RuleType.number().min(1).max(1000).default(10).optional())
  pageSize: number;
}

export class ShowDTO {
  @Rule(RuleType.string().trim().max(10).required())
  id: string;
}

export class RemoveDTO {
  @Rule(RuleType.array().items(RuleType.string().trim().max(10)).min(1))
  ids: string[];
}

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

export class UpdateMenu {
  @Rule(RuleType.string().trim().max(10).required())
  id: string;

  @Rule(RuleType.string().trim().max(10).optional().default('0'))
  parentId: string;

  @Rule(RuleType.string().trim().max(50).required())
  title: string;

  @Rule(
    RuleType.string().trim().max(255).uri({ allowRelative: true }).required()
  )
  uri: string;

  @Rule(RuleType.array().items(RuleType.string().trim().max(10).optional()))
  roles: string[];

  @Rule(RuleType.string().trim().max(10).optional())
  permissionId: string;
}

export class OrderMenu {
  @Rule(
    RuleType.array().items(
      RuleType.object({
        id: RuleType.string().trim().max(10).required(),
        parentId: RuleType.string().trim().max(10).optional().default('0'),
      })
    )
  )
  orders: object[];
}
