import * as assert from 'assert';

import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like, In } from 'typeorm';

import { Context } from '@/interface';

import { AdminUserModel } from '../../model/admin-user';
import { AdminRoleModel } from '../../model/admin-role';
import { AdminPermissionModel } from '../../model/admin-permission';
import { QueryDTO, CreateDTO, UpdateDTO } from '../../dto/admin/user';
import MyError from '../../util/my-error';

@Provide()
export class AdminUserService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(AdminUserModel)
  adminUserModel: Repository<AdminUserModel>;

  /**
   * 分页查询管理员列表
   * @param {QueryDTO} params
   */
  async queryAdminUser(params: QueryDTO) {
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
    if (filter.username) {
      where.username = Like(`${filter.username}%`);
    }

    const [list, total] = await this.adminUserModel.findAndCount({
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
   * 根据管理员id获取数据
   * @param id 管理员id
   */
  async getAdminUserById(id: string) {
    const row = await this.adminUserModel
      .createQueryBuilder()
      .select()
      .leftJoinAndSelect('AdminUserModel.roles', 'role')
      .leftJoinAndSelect('AdminUserModel.permissions', 'permission')
      .where({ id: id })
      .getOne();
    return row;
  }

  /**
   * 创建管理员
   * @param {CreateDTO} params 创建参数
   */
  async createAdminUser(params: CreateDTO) {
    let user = new AdminUserModel();

    // 预处理角色参数
    const roles = params.roles
      ? params.roles.map(item => {
          const role = new AdminRoleModel();
          role.id = item;
          return role;
        })
      : [];

    // 预处理权限参数
    const permissions = params.permissions
      ? params.permissions.map(item => {
          const role = new AdminPermissionModel();
          role.id = item;
          return role;
        })
      : [];

    user = this.adminUserModel.merge(user, {
      ...params,
      roles: roles,
      permissions: permissions,
    });

    const created = await this.adminUserModel.save(user);
    return created;
  }

  /**
   * 更新管理员
   * @param {UpdateDTO} params 更新参数
   */
  async updateAdminUser(params: UpdateDTO) {
    const {
      id,
      roles: newRoles,
      permissions: newPermissions,
      password,
      ...columns
    } = params;

    const user = await this.getAdminUserById(id);

    // 处理密码更新
    let newPassword = user.password;
    if (password) {
      password !== user.password &&
        (newPassword = this.ctx.helper.bhash(password));
    }

    // 如果有传递roles
    if (newRoles) {
      const oldRoles = user.roles.map(item => item.id);
      // 对比角色变更差异
      const [increase, decrease] = this.ctx.helper.arrayDiff(
        newRoles,
        oldRoles
      );

      // 更新角色关联数据
      await Promise.all([
        this.adminUserModel
          .createQueryBuilder()
          .relation(AdminUserModel, 'roles')
          .of(user)
          .add(increase),
        this.adminUserModel
          .createQueryBuilder()
          .relation(AdminUserModel, 'roles')
          .of(user)
          .remove(decrease),
      ]);
    }

    // 如果有传递permissions
    if (newPermissions) {
      const oldPermissions = user.permissions.map(item => item.id);
      // 对比权限变更差异
      const [increase, decrease] = this.ctx.helper.arrayDiff(
        newPermissions,
        oldPermissions
      );

      // 更新权限关联数据
      await Promise.all([
        this.adminUserModel
          .createQueryBuilder()
          .relation(AdminUserModel, 'permissions')
          .of(user)
          .add(increase),
        this.adminUserModel
          .createQueryBuilder()
          .relation(AdminUserModel, 'permissions')
          .of(user)
          .remove(decrease),
      ]);
    }

    return this.adminUserModel
      .createQueryBuilder()
      .update(user)
      .set({ ...columns, password: newPassword })
      .where({ id: id })
      .execute();
  }

  /**
   * 删除多条管理员数据(忽略关联表的数据)
   * @param {string[]}ids 管理员id
   */
  async removeAdminUserByIds(ids: string[]) {
    return this.adminUserModel
      .createQueryBuilder()
      .delete()
      .where({
        id: In(ids),
      })
      .execute();
  }

  /**
   * 检查管理员是否存在于数据库，自动抛错
   * @param {string[]} ids 管理员id
   */
  async checkUserExists(ids: string[]) {
    const count = await this.adminUserModel.count({
      where: {
        id: In(ids),
      },
    });

    assert.deepStrictEqual(
      count,
      ids.length,
      new MyError('管理员不存在，请检查', 400)
    );
  }
}
