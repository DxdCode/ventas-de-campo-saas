import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from "typeorm";
import { RoleEntity } from "./RoleEntity";
import { TokenEntity } from "../auth/TokenEntity";
import { AuthEntity } from "../auth/AuthEntity";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => AuthEntity, (auth) => auth.user)
    auth!: AuthEntity;

    @Column({ length: 100 })
    name!: string;

    @ManyToOne(() => RoleEntity, (role) => role.usuarios, { eager: true })
    @JoinColumn({ name: "rol_id" })
    rol!: RoleEntity;

    @OneToMany(() => TokenEntity, (token) => token.usuario)
    tokens!: TokenEntity[];

    @Column({ default: true })
    isActive!: boolean;

    @DeleteDateColumn()
    deletedAt?: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
