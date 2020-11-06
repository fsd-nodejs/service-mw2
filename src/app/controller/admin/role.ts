import {
  Controller,
  Get,
  Provide,
  Inject,
  Query,
  ALL,
  Validate,
  Post,
  Patch,
  Del,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

import { AdminRoleService } from '../../service/admin/role';
import { QueryDTO } from '../../dto/admin/role';

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

  @Get('/show')
  @Validate()
  async show() {
    // TODO:查询单个角色
  }

  @Post('/create')
  @Validate()
  async create() {
    // TODO:创建角色逻辑
  }

  @Patch('/update')
  @Validate()
  async update() {
    // TODO:更新角色逻辑
  }

  @Del('/remove')
  @Validate()
  async remove() {
    // TODO:删除角色逻辑
  }
}
