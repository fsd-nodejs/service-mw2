import { CreateDateColumn, UpdateDateColumn, AfterLoad } from 'typeorm';

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

  @AfterLoad()
  mixin() {
    this.id = String(this.id);
  }
}
