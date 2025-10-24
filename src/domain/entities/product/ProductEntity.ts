import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("products")
export class ProductEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column()
    sku!: string;

    @Column("int")
    stock!: number;

    @Column({ default: true })
    status!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}