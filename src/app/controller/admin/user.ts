import {
  Controller,
  Get,
  Provide,
  Inject,
  Query,
  ALL,
  Validate,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

import { AdminUserService } from '../../service/admin/user';
import { QueryDTO } from '../../dto/admin/user';

@Provide()
@Controller('/admin/user')
export class AdminUserController {
  @Inject('adminUserService')
  service: AdminUserService;

  @Get('/query')
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminUser(query);
    ctx.helper.success(result);
  }
}
