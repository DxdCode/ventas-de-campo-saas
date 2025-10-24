import { ProductEntity } from "@domain/entities/product/ProductEntity";

export interface IProductRepository {
    create(product: Partial<ProductEntity>): Promise<ProductEntity>;
    update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<ProductEntity | null>;
    findAll(): Promise<ProductEntity[]>;
}