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
   * @param {QueryDTO} params
   */
  async queryAdminPermission(params: QueryDTO) {
    const { pageSize, current, sorter, ...filter } = params;
    const where: any = {};
    const order: any = { id: 'DESC' };

    // 排序方式
    if (sorter) {
      const [column, sort] = sorter.split('_');
      order[column] = sort.split('end')[0].toUpperCase();
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

    // 模糊匹配路径
    if (filter.httpPath) {
      where.httpPath = Like(`${filter.httpPath}%`);
    }

    // 模糊匹配请求方式
    if (filter.httpMethod) {
      where.httpMethod = Like(`${filter.httpMethod}%`);
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
   */
  async getAdminPermissionById(id: string) {
    const row = await this.adminPermissionModel
      .createQueryBuilder()
      .select()
      .leftJoinAndSelect(
        'AdminPermissionModel.roles',
        'role'
        // 'role.deletedAt IS NULL' 软删除关联查询需要的例子
      )
      .leftJoinAndSelect('AdminPermissionModel.menu', 'menu')
      .where({ id: id })
      .getOne();
    return row;
  }

  /**
   * 创建权限
   * @param {CreateDTO} params 权限参数
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
   * 批量删除多条权限数据(忽略关联表的数据)
   * @param {string[]} ids 权限id
   */
  async removeAdminPermissionByIds(ids: string[]) {
    return (
      this.adminPermissionModel
        .createQueryBuilder()
        // .softDelete() // 软删除例子
        .delete()
        .where({
          id: In(ids),
        })
        .execute()
    );
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
