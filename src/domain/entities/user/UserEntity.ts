import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
