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

import { AdminMenuService } from '@/app/service/admin/menu';
import { AdminRoleService } from '@/app/service/admin/role';
import { AdminPermissionService } from '@/app/service/admin/permission';
import { CreateDTO, QueryDTO, ShowDTO } from '@/app/dto/admin/menu';
import MyError from '@/app/util/my-error';

@Provide()
@Controller('/admin/menu')
export class AdminMenuController {
  @Inject('adminMenuService')
  service: AdminMenuService;

  @Inject('adminRoleService')
  roleService: AdminRoleService;

  @Inject('adminPermissionService')
  permissionService: AdminPermissionService;

  @Get('/query')
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminMenu(query);
    ctx.helper.success(result);
  }

  @Get('/show')
  @Validate()
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.getAdminMenuById(query.id);
    assert.ok(result, new MyError('菜单不存在，请检查', 400));
    ctx.helper.success(result);
  }

  @Post('/create')
  @Validate()
  async create(ctx: Context, @Body(ALL) params: CreateDTO) {
    // 检查角色是否存在
    await this.roleService.checkRoleExists(params.roles);

    // 检查权限是否存在
    await this.permissionService.checkPermissionExists([params.permissionId]);

    const result = await this.service.createAdminMenu(params);

    ctx.helper.success(result, null, 201);
  }

  // @Post('/update')
  // @Validate()
  // async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
  //   // 检查菜单是否存在
  //   await this.service.checkMenuExists([params.id]);

  //   // 检查角色是否存在
  //   await this.roleService.checkRoleExists(params.roles);

  //   // 检查权限是否存在
  //   await this.permissionService.checkPermissionExists([params.permissionId]);

  //   const result = await this.service.updateAdminMenu(params);

  //   ctx.helper.success(null, null, 204);
  // }
}
