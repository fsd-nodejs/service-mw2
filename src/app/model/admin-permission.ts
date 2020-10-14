import { EntityModel } from '@midwayjs/orm';
import { Column, AfterLoad, PrimaryGeneratedColumn } from 'typeorm';

import { BaseModel } from './base';

@EntityModel({
  name: 'admin_permissions',
})
export default class AdminPermissionModel extends BaseModel {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '标识',
  })
  slug: string;

  @Column({
    type: 'varchar',
    name: 'http_method',
    comment:
      '请求方式 ["ANY", "DELETE", "POST", "GET", "PUT", "PATCH", "OPTIONS", "HEAD"]',
  })
  httpMethod: string[];

  @Column({
    type: 'text',
    name: 'http_path',
    comment: '请求路径',
  })
  httpPath: string;

  @AfterLoad()
  mixin() {
    this.httpMethod = this.httpMethod?.toString().split(',');
  }
}
