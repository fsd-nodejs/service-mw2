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

import { AdminMenuService } from '@/app/service/admin/menu';
import { QueryDTO } from '@/app/dto/admin/menu';

@Provide()
@Controller('/admin/menu')
export class AdminMenuController {
  @Inject('adminMenuService')
  service: AdminMenuService;

  @Get('/query')
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminMenu(query);
    ctx.helper.success(result);
  }
}
