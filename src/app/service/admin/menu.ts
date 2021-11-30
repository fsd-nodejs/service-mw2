import * as assert from 'assert';

import { Provide, Inject } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, In } from 'typeorm';

import { Context } from '@/interface';

import { AdminMenuModel } from '../../model/admin-menu';
import { CreateDTO, QueryDTO, UpdateDTO } from '../../dto/admin/menu';
import { AdminRoleModel } from '../../model/admin-role';
import MyError from '../../util/my-error';

@Provide()
export class AdminMenuService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(AdminMenuModel)
  adminMenuModel: Repository<AdminMenuModel>;

  /**
   * 分页查询菜单列表
   * @param {QueryDTO} params 查询参数
   */
  async queryAdminMenu(params: QueryDTO) {
    const { pageSize, current } = params;
    const order: any = { order: 'DESC' };

    // 排序方式
    const [list, total] = await this.adminMenuModel.findAndCount({
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
   * 根据菜单id获取数据
   * @param id 菜单id
   */
  async getAdminMenuById(id: string) {
    const row = await this.adminMenuModel
      .createQueryBuilder()
      .select()
      .leftJoinAndSelect('AdminMenuModel.roles', 'role')
      .where({ id: id })
      .getOne();
    return row;
  }

  /**
   * 创建菜单
   * @param {CreateDTO} params 菜单参数
   */
  async createAdminMenu(params: CreateDTO) {
    let menu = new AdminMenuModel();

    // 预处理角色参数
    const roles = params.roles.map(item => {
      const role = new AdminRoleModel();
      role.id = item;
      return role;
    });

    menu = this.adminMenuModel.merge(menu, { ...params, roles: roles });

    const created = await this.adminMenuModel.save(menu);
    return created;
  }

  /**
   * 更新菜单
   * @param {UpdateDTO} params 菜单参数
   */
  async updateAdminMenu(params: UpdateDTO) {
    const { id, roles: newRoles, ...columns } = params;

    const menu = await this.getAdminMenuById(id);

    // 如果有传递roles
    if (newRoles) {
      const oldRoles = menu.roles.map(item => item.id);
      // 对比角色变更差异
      const [increase, decrease] = this.ctx.helper.arrayDiff(
        newRoles,
        oldRoles
      );

      // 更新角色关联数据
      await Promise.all([
        this.adminMenuModel
          .createQueryBuilder()
          .relation(AdminMenuModel, 'roles')
          .of(menu)
          .add(increase),
        this.adminMenuModel
          .createQueryBuilder()
          .relation(AdminMenuModel, 'roles')
          .of(menu)
          .remove(decrease),
      ]);
    }

    return this.adminMenuModel
      .createQueryBuilder()
      .update(menu)
      .set(columns)
      .where({
        id: menu.id,
      })
      .execute();
  }

  /**
   * 删除多条菜单数据(忽略关联表的数据)
   * @param {string[]}ids 菜单id
   */
  async removeAdminMenuByIds(ids: string[]) {
    return this.adminMenuModel
      .createQueryBuilder()
      .delete()
      .where({
        id: In(ids),
      })
      .execute();
  }

  /**
   * 检查菜单是否存在于数据库，自动抛错
   * @param {string[]} ids 菜单id
   */
  async checkMenuExists(ids: string[]) {
    const count = await this.adminMenuModel.count({
      where: {
        id: In(ids),
      },
    });

    assert.deepStrictEqual(
      count,
      ids.length,
      new MyError('菜单不存在，请检查', 400)
    );
  }

  /**
   * 批量更新菜单的排序和父级ID
   * @param params 菜单参数
   */
  async orderAdminMenu(params: any[]) {
    const queue = params.map(item => {
      const { id, ...field } = item;
      return this.adminMenuModel
        .createQueryBuilder()
        .update(field)
        .where({
          id,
        })
        .execute();
    });
    return Promise.all(queue);
  }
}
