import * as assert from 'assert';

import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like, In } from 'typeorm';

import { AdminRoleModel } from '@/app/model/admin-role';
import { QueryDTO } from '@/app/dto/admin/role';
import MyError from '@/app/util/my-error';

@Provide()
export class AdminRoleService {
  @InjectEntityModel(AdminRoleModel)
  adminRoleModel: Repository<AdminRoleModel>;

  async queryAdminRole(queryParams: QueryDTO) {
    const { pageSize, current, sorter, ...params } = queryParams;
    const where: any = {};
    const order: any = { id: 'DESC' };

    // 排序方式
    if (sorter) {
      const [column, sort] = sorter.split('_');
      order[column] = sort;
    }

    // 模糊匹配id
    if (params.id) {
      where.id = Like(params.id);
    }

    // 模糊匹配名称
    if (params.name) {
      where.name = Like(`${params.name}%`);
    }

    // 模糊匹配标识
    if (params.slug) {
      where.slug = Like(`${params.slug}%`);
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
   * 检查角色是否存在于数据库，自动抛错
   * @param {string[]} ids 角色id
   */
  async checkRoleExists(ids: string[]) {
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
