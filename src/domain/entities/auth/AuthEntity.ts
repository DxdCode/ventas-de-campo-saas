import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../user/UserEntity";

@Entity("auth")
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => UserEntity, (user) => user.auth, { eager: true })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
