import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "./RoleEntity";
import { TokenEntity } from "../auth/TokenEntity";

// Definicion de la entidad User
@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @ManyToOne(() => RoleEntity, role => role.usuarios, { eager: true })
    @JoinColumn({ name: "rol_id" })
    rol!: RoleEntity;

    @OneToMany(() => TokenEntity, token => token.usuario)
    tokens!: TokenEntity[];
}
