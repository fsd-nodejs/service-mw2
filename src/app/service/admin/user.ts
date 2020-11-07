import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like } from 'typeorm';

import { AdminUserModel } from '../../model/admin-user';
import { QueryDTO } from '../../dto/admin/user';

@Provide()
export class AdminUserService {
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
}
