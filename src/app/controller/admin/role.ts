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

import { AdminRoleService } from '@/APP/service/admin/role';
import { QueryDTO } from '@/app/dto/admin/role';

@Provide()
@Controller('/admin/role')
export class AdminRoleController {
  @Inject('adminRoleService')
  service: AdminRoleService;

  @Get('/query')
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminRole(query);
    ctx.helper.success(result);
  }
}
