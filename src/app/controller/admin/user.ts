import {
  Controller,
  Get,
  Provide,
  Inject,
  Query,
  ALL,
  Post,
  Patch,
  Del,
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
  @Get('/show')
  @Validate()
  async show() {
    // TODO:查询单个用户
  }

  @Post('/create')
  @Validate()
  async create() {
    // TODO:创建用户逻辑
  }

  @Patch('/update')
  @Validate()
  async update() {
    // TODO:更新用户逻辑
  }

  @Del('/remove')
  @Validate()
  async remove() {
    // TODO:删除用户逻辑
  }
}
