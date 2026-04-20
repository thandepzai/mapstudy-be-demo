import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'int' })
  gender: number;

  @Column({ nullable: true, type: 'int' })
  birthYear: number;

  @Column({ nullable: true })
  facebookLink: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  school: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  refresh_token: string;
}
