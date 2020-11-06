import * as assert from 'assert';

import { Provide, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/web';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, In } from 'typeorm';

import { AdminMenuModel } from '../../model/admin-menu';
import { CreateDTO, QueryDTO } from '../../dto/admin/menu';
import { AdminRoleModel } from '../../model/admin-role';
import MyError from '../../util/my-error';

@Provide()
export class AdminMenuService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(AdminMenuModel)
  adminMenuModel: Repository<AdminMenuModel>;

  @InjectEntityModel(AdminRoleModel)
  adminRoleModel: Repository<AdminRoleModel>;

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
      .where({ id: id })
      .getOne();

    return row;
  }

  /**
   * 创建菜单
   * @param {CreateDTO} params 菜单参数
   * @returns {id|undefined}
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
    return created.id;
  }

  /**
   * 更新菜单
   * @param {UpdateDTO} params 菜单参数
   * @returns {[number, AdminMenuModel[]]}
   */
  // async updateAdminMenu(id: string, params: UpdateDTO) {
  //   const { roles: newRoles } = params;

  //   const menu = await this.getAdminMenuById(id);

  //   // 如果有传递roles
  //   if (newRoles) {
  //     const oldRoles = menu.roles.map(item => item.id);

  //     // 对比角色变更差异
  //     const [increase, decrease]: [any[], any[]] = this.ctx.helper.arrayDiff(
  //       newRoles,
  //       oldRoles
  //     );

  //     const increaseRoleMenu = increase.map(item => ({
  //       roleId: item,
  //       menuId: menu.id,
  //     }));

  //     await this.adminRoleMenuModel.bulkCreate(increaseRoleMenu);
  //     await this.adminRoleMenuModel.destroy({
  //       where: {
  //         roleId: decrease,
  //         menuId: menu.id,
  //       },
  //     });
  //   }

  //   return this.adminMenuModel.update(params, {
  //     where: {
  //       id,
  //     },
  //     limit: 1,
  //   });
  // }

  /**
   * 检查菜单是否存在于数据库，自动抛错
   * @param {string[]} ids 菜单id
   */
  public async checkMenuExists(ids: string[]) {
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
}
