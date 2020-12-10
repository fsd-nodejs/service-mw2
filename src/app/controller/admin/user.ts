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
import { Context } from 'egg';

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
@Controller('/admin/user', {
  tagName: '管理员管理',
  description: '包含管理员的增、删、改、查',
})
export class AdminUserController {
  @Inject('adminUserService')
  service: AdminUserService;

  @Inject('adminRoleService')
  roleService: AdminRoleService;

  @Inject('adminPermissionService')
  permissionService: AdminPermissionService;

  @Get('/query', {
    summary: '获取管理员列表',
    description: '分页接口，查询管理员列表',
  })
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminUser(query);
    ctx.helper.success(result);
  }

  @Get('/show', {
    summary: '获取单个管理员详情',
    description: '获取管理员的详细信息，包括其关联的对象',
  })
  @Validate()
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.getAdminUserById(query.id);
    assert.ok(result, new MyError('管理员不存在，请检查', 400));
    ctx.helper.success(result);
  }

  @Post('/create', {
    summary: '创建管理员',
    description: '会校验要关联的角色和权限是否存在',
  })
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

  @Patch('/update', {
    summary: '更新管理员数据',
    description: '可更新管理员一个或多个字段',
  })
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

  @Del('/remove', {
    summary: '删除管理员',
    description: '关联关系表不会删除其中的内容，可以同时删除多个管理员',
  })
  @Validate()
  async remove(ctx: Context, @Body(ALL) params: RemoveDTO) {
    // 检查管理员是否存在
    await this.service.checkUserExists(params.ids);

    const total = await this.service.removeAdminUserByIds(params.ids);
    assert(total, new MyError('删除失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }
}
