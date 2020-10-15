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

import { AdminPermissionService } from '@/APP/service/admin/permission';
import { QueryDTO } from '@/app/dto/admin/permission';

@Provide()
@Controller('/admin/permission')
export class AdminPermissionController {
  @Inject('adminPermissionService')
  service: AdminPermissionService;

  @Get('/query')
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminPermission(query);
    ctx.helper.success(result);
  }
}
