import * as assert from 'assert';

import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like, In } from 'typeorm';

import { AdminPermissionModel } from '@/app/model/admin-permission';
import { QueryDTO, CreateDTO, UpdateDTO } from '@/app/dto/admin/permission';
import MyError from '@/app/util/my-error';

@Provide()
export class AdminPermissionService {
  @InjectEntityModel(AdminPermissionModel)
  adminPermissionModel: Repository<AdminPermissionModel>;

  /**
   * 分页查询权限列表
   * @param {QueryDTO} queryParams
   */
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

  /**
   * 通过ID获取单条权限数据
   * @param {String} id
   * @returns {AdminPermissionModel | null}
   */
  async getAdminPermissionById(id: string) {
    return this.adminPermissionModel.findOne({
      relations: ['roles', 'menu'],
      where: {
        id,
      },
    });
  }

  async createAdminPermission(params: CreateDTO) {
    return this.adminPermissionModel.create(params);
  }

  async updateAdminPermission(params: UpdateDTO) {
    const { id, ...values } = params;
    return this.adminPermissionModel
      .createQueryBuilder()
      .update()
      .set(values)
      .where('id = :id', { id })
      .execute();
  }

  /**
   * 检查权限是否存在于数据库，自动抛错
   * @param {string[]} ids 权限id
   */
  async checkPermissionExists(ids: string[]) {
    const count = await this.adminPermissionModel.count({
      where: {
        id: In(ids),
      },
    });

    assert.deepStrictEqual(
      count,
      ids.length,
      new MyError('权限不存在，请检查', 400)
    );
  }
}
