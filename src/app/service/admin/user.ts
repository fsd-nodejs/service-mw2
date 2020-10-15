import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like } from 'typeorm';

import { AdminUserModel } from '@/app/model/admin-user';
import { QueryDTO } from '@/app/dto/admin/user';

@Provide()
export class AdminUserService {
  @InjectEntityModel(AdminUserModel)
  adminUserModel: Repository<AdminUserModel>;

  async queryAdminUser(queryParams: QueryDTO) {
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
    if (params.username) {
      where.username = Like(`${params.username}%`);
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
