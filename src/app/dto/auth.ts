import { Rule, RuleType } from '@midwayjs/decorator';
import { CreateApiPropertyDoc } from '@midwayjs/swagger';

export class LoginDTO {
  @CreateApiPropertyDoc('管理员帐号')
  @Rule(RuleType.string().required().min(5).max(190))
  username: string;

  @CreateApiPropertyDoc('密码')
  @Rule(RuleType.string().required().min(5).max(60))
  password: string;
}
