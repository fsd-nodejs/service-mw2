import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like } from 'typeorm';

import { AdminPermissionModel } from '@/app/model/admin-permission';
import { QueryDTO } from '@/app/dto/admin/permission';

@Provide()
export class AdminPermissionService {
  @InjectEntityModel(AdminPermissionModel)
  adminPermissionModel: Repository<AdminPermissionModel>;

  async queryAdminPermission(queryParams: QueryDTO) {
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

    // 模糊匹配路径
    if (params.httpPath) {
      where.httpPath = Like(`${params.httpPath}%`);
    }

    // 模糊匹配请求方式
    if (params.httpMethod) {
      where.httpMethod = Like(`${params.httpMethod}%`);
    }

    const [list, total] = await this.adminPermissionModel.findAndCount({
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
