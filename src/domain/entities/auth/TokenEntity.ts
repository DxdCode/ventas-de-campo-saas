import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "../user/UserEntity";

@Entity("tokens")
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  refreshToken!: string;

  @Column()
  expiracion!: Date;

  @ManyToOne(() => UserEntity, user => user.tokens)
  @JoinColumn({ name: "usuario_id" })
  usuario!: UserEntity;
}
