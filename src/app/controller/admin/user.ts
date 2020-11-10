import * as assert from 'assert';

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
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';

import { AdminUserService } from '../../service/admin/user';
import {
  QueryDTO,
  ShowDTO,
  CreateDTO,
  UpdateDTO,
  RemoveDTO,
} from '../../dto/admin/user';
import MyError from '../../util/my-error';
import { AdminRoleService } from '../../service/admin/role';
import { AdminPermissionService } from '../../service/admin/permission';

@Provide()
@Controller('/admin/user')
export class AdminUserController {
  @Inject('adminUserService')
  service: AdminUserService;

  @Inject('adminRoleService')
  roleService: AdminRoleService;

  @Inject('adminPermissionService')
  permissionService: AdminPermissionService;

  @Get('/query')
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminUser(query);
    ctx.helper.success(result);
  }

  @Get('/show')
  @Validate()
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.getAdminUserById(query.id);
    assert.ok(result, new MyError('管理员不存在，请检查', 400));
    ctx.helper.success(result);
  }

  @Post('/create')
  @Validate()
  async create(ctx: Context, @Body(ALL) params: CreateDTO) {
    const { roles, permissions } = params;

    // 检查角色是否存在
    await this.roleService.checkRoleExists(roles);

    // 检查权限是否存在
    await this.permissionService.checkPermissionExists(permissions);

    const passwordHash = ctx.helper.bhash(params.password);

    const result = await this.service.createAdminUser({
      ...params,
      password: passwordHash,
    });

    ctx.helper.success(result, null, 201);
  }

  @Patch('/update')
  @Validate()
  async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
    const { roles, permissions } = params;

    // 检查角色是否存在
    await this.roleService.checkRoleExists(roles);

    // 检查权限是否存在
    await this.permissionService.checkPermissionExists(permissions);

    const { affected } = await this.service.updateAdminUser(params);
    assert(affected, new MyError('更新失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }

  @Del('/remove')
  @Validate()
  async remove(ctx: Context, @Body(ALL) params: RemoveDTO) {
    // 检查管理员是否存在
    await this.service.checkUserExists(params.ids);

    const total = await this.service.removeAdminUserByIds(params.ids);
    assert(total, new MyError('删除失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }
}
