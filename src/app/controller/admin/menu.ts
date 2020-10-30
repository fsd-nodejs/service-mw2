import * as assert from 'assert';

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
import { QueryDTO, ShowDTO } from '@/app/dto/admin/menu';
import MyError from '@/app/util/my-error';

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

  @Get('/show')
  @Validate()
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.showAdminMenu(query);
    assert.ok(result, new MyError('菜单不存在，请检查', 400));
    ctx.helper.success(result);
  }
}
