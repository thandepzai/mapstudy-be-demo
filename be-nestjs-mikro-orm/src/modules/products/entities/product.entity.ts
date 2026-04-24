import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property()
  name!: string;

  @Property()
  price!: number;

  @Property({ default: 0 })
  stock: number = 0;

  // Quan hệ: Nhiều sản phẩm thuộc về 1 User
  @ManyToOne(() => User, { fieldName: 'user_id' })
  createdBy!: User;

  @Property()
  created_at: Date = new Date();
}
