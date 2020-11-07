import * as assert from 'assert';

import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, Like, In } from 'typeorm';

import { AdminPermissionModel } from '../../model/admin-permission';
import { QueryDTO, CreateDTO, UpdateDTO } from '../../dto/admin/permission';
import MyError from '../../util/my-error';

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
    const row = await this.adminPermissionModel
      .createQueryBuilder()
      .select()
      .leftJoinAndSelect(
        'AdminPermissionModel.roles',
        'role',
        'role.deletedAt IS NULL'
      )
      .leftJoinAndSelect(
        'AdminPermissionModel.menu',
        'menu',
        'menu.deletedAt IS NULL'
      )
      .where({ id: id })
      .getOne();
    return row;
  }

  /**
   * 创建权限
   * @param {CreateDTO} params 权限参数
   * @returns
   */
  async createAdminPermission(params: CreateDTO) {
    let permission = new AdminPermissionModel();
    permission = this.adminPermissionModel.merge(permission, params);

    const created = await this.adminPermissionModel.save(permission);
    return created;
  }

  /**
   * 更新权限
   * @param {UpdateDTO} params 更新权限参数
   */
  async updateAdminPermission(params: UpdateDTO) {
    const { id, ...columns } = params;
    return this.adminPermissionModel
      .createQueryBuilder()
      .update()
      .set(columns)
      .where('id = :id', { id })
      .execute();
  }

  /**
   * 检查权限是否存在于数据库，自动抛错
   * @param {string[]} ids 权限id
   */
  async checkPermissionExists(ids: string[] = []) {
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
