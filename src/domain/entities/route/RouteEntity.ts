import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { UserEntity } from "../user/UserEntity";

@Entity("routes")
export class RouteEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ default: true })
    status!: boolean;

    @ManyToMany(() => UserEntity, { eager: true })
    @JoinTable({
        name: "route_users",
        joinColumn: {
            name: "route_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })
    assignedUsers!: UserEntity[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}