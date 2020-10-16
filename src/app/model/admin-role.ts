import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

import { BaseModel } from './base';
import { AdminPermissionModel } from './admin-permission';
import { AdminUserModel } from './admin-user';
import { AdminMenuModel } from './admin-menu';

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

  @ManyToMany(type => AdminPermissionModel, permission => permission.roles)
  permissions: AdminPermissionModel[];

  @ManyToMany(type => AdminUserModel, user => user.roles)
  users: AdminUserModel[];

  @ManyToMany(type => AdminMenuModel, menu => menu.roles)
  menu: AdminUserModel[];
}
