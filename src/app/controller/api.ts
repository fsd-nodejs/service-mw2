import { Inject, Controller, Post, Provide, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

import { UserService } from '@/app/service/user';

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/get_user')
  async getUser(@Query() uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }
}
