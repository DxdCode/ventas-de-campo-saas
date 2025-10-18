import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity("roles")
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 50 })
    nombre!: string;

    @OneToMany(() => UserEntity, user => user.rol)
    usuarios!: UserEntity[];
}
