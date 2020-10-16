import { Rule, RuleType } from '@midwayjs/decorator';

export class QueryDTO {
  @Rule(RuleType.number().min(1).max(100000).default(1).optional())
  current: number;

  @Rule(RuleType.number().min(1).max(1000).default(10).optional())
  pageSize: number;
}
