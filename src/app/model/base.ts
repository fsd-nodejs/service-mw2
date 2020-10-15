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

  // 对字段进行预处理
  @AfterLoad()
  init() {
    this.id = String(this.id);
  }
}
