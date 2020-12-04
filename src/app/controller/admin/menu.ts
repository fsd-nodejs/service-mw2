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
  Body,
  Del,
} from '@midwayjs/decorator';
import { Context } from 'egg';

import { AdminMenuService } from '../../service/admin/menu';
import { AdminRoleService } from '../../service/admin/role';
import { AdminPermissionService } from '../../service/admin/permission';
import {
  CreateDTO,
  OrderMenuDTO,
  QueryDTO,
  RemoveDTO,
  ShowDTO,
  UpdateDTO,
} from '../../dto/admin/menu';
import MyError from '../../util/my-error';

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

  @Patch('/update')
  @Validate()
  async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
    // 检查菜单是否存在
    await this.service.checkMenuExists([params.id]);

    // 检查角色是否存在
    await this.roleService.checkRoleExists(params.roles);

    // 检查权限是否存在
    await this.permissionService.checkPermissionExists([params.permissionId]);

    const { affected } = await this.service.updateAdminMenu(params);
    assert(affected, new MyError('更新失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }

  @Del('/remove')
  @Validate()
  async remove(ctx: Context, @Body(ALL) params: RemoveDTO) {
    // 检查菜单是否存在
    await this.service.checkMenuExists(params.ids);

    const total = await this.service.removeAdminMenuByIds(params.ids);

    assert(total, new MyError('删除失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }

  @Post('/order')
  @Validate()
  async order(ctx: Context, @Body(ALL) params: OrderMenuDTO) {
    const { orders } = params;

    // 检查菜单是否存在
    await this.service.checkMenuExists(orders.map(item => item.id));

    const newMenu = orders.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    await this.service.orderAdminMenu(newMenu);

    ctx.helper.success();
  }
}
