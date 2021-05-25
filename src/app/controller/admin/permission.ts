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
import { Context } from 'egg';

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
@Controller('/admin/permission', {
  tagName: '权限管理',
  description: '包含权限的增、删、改、查',
})
export class AdminPermissionController {
  @Inject('adminPermissionService')
  service: AdminPermissionService;

  @Inject('adminRoleService')
  roleService: AdminRoleService;

  @Get('/query', {
    summary: '获取权限列表',
    description: '分页接口，查询权限列表',
  })
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminPermission(query);
    ctx.helper.success(result);
  }

  @Get('/show', {
    summary: '获取单个权限详情',
    description: '获取权限的详细信息，包括其关联的对象',
  })
  @Validate()
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.getAdminPermissionById(query.id);
    assert.ok(result, new MyError('权限不存在，请检查', 400));
    ctx.helper.success(result);
  }

  @Post('/create', {
    summary: '创建权限',
    description: '',
  })
  @Validate()
  async create(ctx: Context, @Body(ALL) params: CreateDTO) {
    const result = await this.service.createAdminPermission(params);

    ctx.helper.success(result, null, 201);
  }

  @Patch('/update', {
    summary: '更新权限数据',
    description: '可更新权限一个或多个字段',
  })
  @Validate()
  async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
    // 检查权限是否存在
    await this.service.checkPermissionExists([params.id]);

    const { affected } = await this.service.updateAdminPermission(params);
    assert.ok(affected, new MyError('更新失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }

  @Del('/remove', {
    summary: '删除权限',
    description: '关联关系表不会删除其中的内容，可以同时删除多个权限',
  })
  @Validate()
  async remove(ctx: Context, @Body(ALL) params: RemoveDTO) {
    // 检查权限是否存在
    await this.service.checkPermissionExists(params.ids);

    const total = await this.service.removeAdminPermissionByIds(params.ids);
    assert.ok(total, new MyError('删除失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }
}
