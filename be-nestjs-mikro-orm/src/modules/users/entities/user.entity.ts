import { Entity, PrimaryKey, Property, BeforeCreate } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property()
  fullName!: string;

  @Property({ unique: true })
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  phone!: string;

  @Property()
  gender!: number;

  @Property()
  birthYear!: number;

  @Property({ nullable: true })
  facebookLink?: string;

  @Property()
  province!: string;

  @Property()
  school!: string;

  @Property({ hidden: true, nullable: true })
  refresh_token?: string;

  @Property()
  created_at: Date = new Date();

  @BeforeCreate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
