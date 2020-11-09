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
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

import { AdminRoleService } from '../../service/admin/role';
import { AdminPermissionService } from '../../service/admin/permission';
import {
  QueryDTO,
  ShowDTO,
  CreateDTO,
  UpdateDTO,
  RemoveDTO,
} from '../../dto/admin/role';
import MyError from '../../util/my-error';

@Provide()
@Controller('/admin/role')
export class AdminRoleController {
  @Inject('adminRoleService')
  service: AdminRoleService;

  @Inject('adminPermissionService')
  permissionService: AdminPermissionService;

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
    assert.ok(result, new MyError('角色不存在，请检查', 400));
    ctx.helper.success(result);
  }

  @Post('/create')
  @Validate()
  async create(ctx: Context, @Body(ALL) params: CreateDTO) {
    // 检查权限是否存在
    await this.permissionService.checkPermissionExists(params.permissions);

    const result = await this.service.createAdminRole(params);

    ctx.helper.success(result, null, 201);
  }

  @Patch('/update')
  @Validate()
  async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
    // 检查角色是否存在
    await this.service.checkRoleExists([params.id]);

    const { affected } = await this.service.updateAdminRole(params);
    assert(affected, new MyError('更新失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }

  @Del('/remove')
  @Validate()
  async remove(ctx: Context, @Body(ALL) params: RemoveDTO) {
    // 检查角色是否存在
    await this.service.checkRoleExists(params.ids);

    const total = await this.service.removeAdminRoleByIds(params.ids);
    assert(total, new MyError('删除失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }
}
