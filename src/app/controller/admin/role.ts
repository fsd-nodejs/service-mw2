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
import { Context } from 'egg';

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
@Controller('/admin/role', {
  tagName: '角色管理',
  description: '包含角色的增、删、改、查',
})
export class AdminRoleController {
  @Inject('adminRoleService')
  service: AdminRoleService;

  @Inject('adminPermissionService')
  permissionService: AdminPermissionService;

  @Get('/query', {
    summary: '获取角色列表',
    description: '分页接口，查询角色列表',
  })
  @Validate()
  async query(ctx: Context, @Query(ALL) query: QueryDTO) {
    const result = await this.service.queryAdminRole(query);
    ctx.helper.success(result);
  }

  @Get('/show', {
    summary: '获取单个角色详情',
    description: '获取角色的详细信息，包括其关联的对象',
  })
  @Validate()
  async show(ctx: Context, @Query(ALL) query: ShowDTO) {
    const result = await this.service.getAdminRoleById(query.id);
    assert.ok(result, new MyError('角色不存在，请检查', 400));
    ctx.helper.success(result);
  }

  @Post('/create', {
    summary: '创建角色',
    description: '会校验关联的权限是否存在',
  })
  @Validate()
  async create(ctx: Context, @Body(ALL) params: CreateDTO) {
    // 检查角色是否存在
    await this.permissionService.checkPermissionExists(params.permissions);

    const result = await this.service.createAdminRole(params);

    ctx.helper.success(result, null, 201);
  }

  @Patch('/update', {
    summary: '更新角色数据',
    description: '可更新角色一个或多个字段',
  })
  @Validate()
  async update(ctx: Context, @Body(ALL) params: UpdateDTO) {
    // 检查角色是否存在
    await this.service.checkRoleExists([params.id]);

    const { affected } = await this.service.updateAdminRole(params);
    assert.ok(affected, new MyError('更新失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }

  @Del('/remove', {
    summary: '删除角色',
    description: '关联关系表不会删除其中的内容，可以同时删除多个角色',
  })
  @Validate()
  async remove(ctx: Context, @Body(ALL) params: RemoveDTO) {
    // 检查角色是否存在
    await this.service.checkRoleExists(params.ids);

    const total = await this.service.removeAdminRoleByIds(params.ids);
    assert.ok(total, new MyError('删除失败，请检查', 400));

    ctx.helper.success(null, null, 204);
  }
}
