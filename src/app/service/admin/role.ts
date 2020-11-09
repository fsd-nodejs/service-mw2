import * as assert from 'assert';

import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like, In } from 'typeorm';

import { AdminRoleModel } from '../../model/admin-role';
import { QueryDTO } from '../../dto/admin/role';
import MyError from '../../util/my-error';

@Provide()
export class AdminRoleService {
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
      order[column] = sort;
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
   * 通过ID获取单条权限数据
   * @param {String} id
   */
  async getAdminRoleById(id: string) {
    const row = await this.adminRoleModel
      .createQueryBuilder()
      .select()
      .leftJoinAndSelect(
        'AdminRoleModel.permissions',
        'permission',
        'permission.deletedAt IS NULL'
      )
      .leftJoinAndSelect(
        'AdminRoleModel.menu',
        'menu',
        'menu.deletedAt IS NULL'
      )
      .where({ id: id })
      .getOne();
    return row;
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
