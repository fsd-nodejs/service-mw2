import * as assert from 'assert';

import {
  Controller,
  Get,
  Provide,
  Inject,
  Query,
  ALL,
  Validate,
  Post,
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

import { AdminPermissionService } from '@/APP/service/admin/permission';
import { QueryDTO, UpdateDTO } from '@/app/dto/admin/permission';
import MyError from '@/app/util/my-error';

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

  @Post('/update')
  @Validate()
  async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
    const { affected } = await this.service.updateAdminPermission(params);

    assert(affected, new MyError('更新失败', 400));
    ctx.helper.success(null, null, 204);
  }
}
