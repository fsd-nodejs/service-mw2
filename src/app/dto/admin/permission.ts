import { Rule, RuleType } from '@midwayjs/decorator';

export class QueryDTO {
  @Rule(RuleType.number().min(1).max(100000).default(1).optional())
  current: number;

  @Rule(RuleType.number().min(1).max(1000).default(10).optional())
  pageSize: number;

  @Rule(RuleType.string().trim().max(10).optional())
  id: string;

  @Rule(RuleType.string().trim().max(50).optional())
  name: string;

  @Rule(RuleType.string().trim().max(50).optional())
  slug: string;

  @Rule(RuleType.string().trim().max(50).optional())
  httpPath: string;

  @Rule(RuleType.string().trim().max(50).optional())
  httpMethod: string;

  @Rule(
    RuleType.string()
      .trim()
      .max(50)
      .regex(/^[a-zA-Z]*(_ASC|_DESC)$/)
      .optional()
  )
  sorter: string;
}
