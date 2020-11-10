import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  AfterLoad,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { BaseModel } from './base';
import { AdminRoleModel } from './admin-role';
import { AdminPermissionModel } from './admin-permission';

@EntityModel({
  name: 'admin_menu',
})
export class AdminMenuModel extends BaseModel {
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  id: string;

  @Column({
    type: 'integer',
    name: 'parent_id',
    comment: '父级ID',
  })
  parentId: string;

  @Column({
    type: 'integer',
    name: 'permission_id',
    comment: '权限ID',
  })
  permissionId: string;

  @Column({
    type: 'int',
    comment: '排序，数值越大越靠后',
  })
  order: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '路径',
  })
  uri: string;

  @ManyToMany(type => AdminRoleModel, role => role.menu)
  @JoinTable({
    name: 'admin_role_menu',
    joinColumn: {
      name: 'menu_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: AdminRoleModel[];

  @ManyToOne(type => AdminPermissionModel, permission => permission.menu)
  @JoinColumn({
    name: 'permission_id',
    referencedColumnName: 'id',
  })
  permission: AdminPermissionModel;

  @AfterLoad()
  mixin() {
    this.parentId = String(this.parentId);
    this.permissionId = String(this.permissionId);
  }
}
