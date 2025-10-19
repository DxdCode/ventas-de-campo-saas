import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "../user/UserEntity";

// Definicion de la entidad tokens
@Entity("tokens")
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  refreshToken!: string;

  @Column()
  expiracion!: Date;

  @ManyToOne(() => UserEntity, user => user.tokens,  { eager: true })
  @JoinColumn({ name: "usuario_id" })
  usuario!: UserEntity;
}
