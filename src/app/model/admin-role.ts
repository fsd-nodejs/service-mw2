import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';

import { BaseModel } from './base';
import { AdminPermissionModel } from './admin-permission';

@EntityModel({
  name: 'admin_roles',
})
export class AdminRoleModel extends BaseModel {
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

  @ManyToMany(type => AdminPermissionModel)
  @JoinTable()
  permissions: AdminPermissionModel[];
}
