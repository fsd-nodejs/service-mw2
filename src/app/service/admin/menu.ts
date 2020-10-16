import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { AdminMenuModel } from '@/app/model/admin-menu';
import { QueryDTO } from '@/app/dto/admin/menu';

@Provide()
export class AdminMenuService {
  @InjectEntityModel(AdminMenuModel)
  adminMenuModel: Repository<AdminMenuModel>;

  async queryAdminMenu(queryParams: QueryDTO) {
    const { pageSize, current } = queryParams;
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
}
