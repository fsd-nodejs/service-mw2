import {
  CreateDateColumn,
  UpdateDateColumn,
  // DeleteDateColumn, // 软删除需要引入
  AfterLoad,
} from 'typeorm';

/**
 * 基础的Model，对id字段默认会 转字符串处理
 *
 * 继承该Model的话，必须是有id字段的表
 *
 * 默认还会有createdAt、updatedAt
 */
export class BaseModel {
  id: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  // 软删除默认需要配置的字段
  // @DeleteDateColumn({
  //   name: 'deleted_at',
  //   select: false,
  // })
  // deletedAt: Date;

  // 对字段进行预处理
  @AfterLoad()
  init() {
    this.id = String(this.id);
  }
}
