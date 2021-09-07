import * as assert from 'assert';

import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like, In } from 'typeorm';

import { Context } from '@/interface';

import { AdminPermissionModel } from '../../model/admin-permission';
import { AdminRoleModel } from '../../model/admin-role';
import { QueryDTO, CreateDTO, UpdateDTO } from '../../dto/admin/role';
import MyError from '../../util/my-error';

@Provide()
export class AdminRoleService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(AdminRoleModel)
  adminRoleModel: Repository<AdminRoleModel>;

  /**
   * 分页查询角色列表
   * @param {QueryDTO} params
   */
  async queryAdminRole(params: QueryDTO) {
    const { pageSize, current, sorter, ...filter } = params;
    const where: any = {};
    const order: any = { id: 'DESC' };

    // 排序方式
    if (sorter) {
      const [column, sort] = sorter.split('_');
      order[column] = sort.split('end')[0].toUpperCase();
    }

    // 模糊匹配id
    if (filter.id) {
      where.id = Like(filter.id);
    }

    // 模糊匹配名称
    if (filter.name) {
      where.name = Like(`${filter.name}%`);
    }

    // 模糊匹配标识
    if (filter.slug) {
      where.slug = Like(`${filter.slug}%`);
    }

    const [list, total] = await this.adminRoleModel.findAndCount({
      where,
      order,
      take: pageSize,
      skip: pageSize * (current - 1),
    });

    return {
      current,
      pageSize,
      total,
      list,
    };
  }

  /**
   * 通过ID获取单条角色数据
   * @param {String} id
   */
  async getAdminRoleById(id: string) {
    const row = await this.adminRoleModel
      .createQueryBuilder()
      .select()
      .leftJoinAndSelect('AdminRoleModel.permissions', 'permission')
      .leftJoinAndSelect('AdminRoleModel.menu', 'menu')
      .where({ id: id })
      .getOne();
    return row;
  }

  /**
   * 创建角色
   * @param {CreateDTO} params 角色参数
   */
  async createAdminRole(params: CreateDTO) {
    let role = new AdminRoleModel();

    const permissions = params.permissions
      ? params.permissions.map(item => {
          const permission = new AdminPermissionModel();
          permission.id = item;
          return permission;
        })
      : [];

    role = this.adminRoleModel.merge(role, {
      ...params,
      permissions: permissions,
    });

    const created = await this.adminRoleModel.save(role);
    return created;
  }

  /**
   * 更新角色
   * @param {UpdateDTO} params
   */
  async updateAdminRole(params: UpdateDTO) {
    const { id, permissions: newPermissions, ...column } = params;
    const role = await this.getAdminRoleById(id);

    // 如果有传递permissions
    if (newPermissions) {
      const oldPermissions = role.permissions.map(item => item.id);

      const [increase, decrease] = this.ctx.helper.arrayDiff(
        newPermissions,
        oldPermissions
      );

      await Promise.all([
        this.adminRoleModel
          .createQueryBuilder()
          .relation(AdminRoleModel, 'permissions')
          .of(role)
          .add(increase),
        this.adminRoleModel
          .createQueryBuilder()
          .relation(AdminRoleModel, 'permissions')
          .of(role)
          .remove(decrease),
      ]);
    }

    return this.adminRoleModel
      .createQueryBuilder()
      .update(role)
      .set(column)
      .where({ id: id })
      .execute();
  }

  /**
   * 删除多条角色数据(忽略关联表的数据)
   * @param {string[]}ids 角色id
   */
  async removeAdminRoleByIds(ids: string[]) {
    return this.adminRoleModel
      .createQueryBuilder()
      .delete()
      .where({
        id: In(ids),
      })
      .execute();
  }

  /**
   * 检查角色是否存在于数据库，自动抛错
   * @param {string[]} ids 角色id
   */
  async checkRoleExists(ids: string[] = []) {
    const count = await this.adminRoleModel.count({
      where: {
        id: In(ids),
      },
    });

    assert.deepStrictEqual(
      count,
      ids.length,
      new MyError('角色不存在，请检查', 400)
    );
  }
}
