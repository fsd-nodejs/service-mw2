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
  Patch,
  Del,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

import { AdminRoleService } from '../../service/admin/role';
import { QueryDTO, ShowDTO } from '../../dto/admin/role';
import MyError from '../../util/my-error';

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
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.getAdminRoleById(query.id);
    assert.ok(result, new MyError('权限不存在，请检查', 400));
    ctx.helper.success(result);
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
