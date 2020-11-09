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
  Del,
  Patch,
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

import { AdminRoleService } from '../../service/admin/role';
import { AdminPermissionService } from '../../service/admin/permission';
import {
  QueryDTO,
  CreateDTO,
  UpdateDTO,
  ShowDTO,
  RemoveDTO,
} from '../../dto/admin/permission';
import MyError from '../../util/my-error';

@Provide()
@Controller('/admin/permission')
export class AdminPermissionController {
  @Inject('adminPermissionService')
  service: AdminPermissionService;

  @Inject('adminRoleService')
  roleService: AdminRoleService;

  @Get('/query')
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminPermission(query);
    ctx.helper.success(result);
  }

  @Get('/show')
  @Validate()
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.getAdminPermissionById(query.id);
    assert.ok(result, new MyError('权限不存在，请检查', 400));
    ctx.helper.success(result);
  }

  @Post('/create')
  @Validate()
  async create(ctx: Context, @Body(ALL) params: CreateDTO) {
    const result = await this.service.createAdminPermission(params);

    ctx.helper.success(result, null, 201);
  }

  @Patch('/update')
  @Validate()
  async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
    // 检查权限是否存在
    await this.service.checkPermissionExists([params.id]);

    const { affected } = await this.service.updateAdminPermission(params);
    assert(affected, new MyError('更新失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }

  @Del('/remove')
  @Validate()
  async remove(ctx: Context, @Body(ALL) params: RemoveDTO) {
    // 检查权限是否存在
    await this.service.checkPermissionExists(params.ids);

    const total = await this.service.removePermissionByIds(params.ids);
    assert(total, new MyError('删除失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }
}
