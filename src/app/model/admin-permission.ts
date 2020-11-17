import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  AfterLoad,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { BaseModel } from './base';
import { AdminRoleModel } from './admin-role';
import { AdminUserModel } from './admin-user';
import { AdminMenuModel } from './admin-menu';

@EntityModel({
  name: 'admin_permissions',
})
export class AdminPermissionModel extends BaseModel {
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

  @ManyToMany(type => AdminRoleModel, role => role.permissions)
  @JoinTable({
    name: 'admin_role_permissions',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: AdminRoleModel[];

  @ManyToMany(type => AdminUserModel, user => user.permissions)
  @JoinTable({
    name: 'admin_user_permissions',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: AdminUserModel[];

  @OneToMany(type => AdminMenuModel, menu => menu.permission)
  menu: AdminMenuModel[];

  @AfterLoad()
  mixin() {
    this.httpMethod = this.httpMethod
      ? this.httpMethod.toString().split(',')
      : [];
  }

  @BeforeInsert()
  @BeforeUpdate()
  before() {
    this.httpMethod = (this.httpMethod.join(',') as unknown) as string[];
  }
}
