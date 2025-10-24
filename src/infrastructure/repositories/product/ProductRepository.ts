import { IProductRepository } from "@application/ports/product/IProductRepository";
import { ProductEntity } from "@domain/entities/product/ProductEntity";
import { injectable, inject } from "tsyringe";
import { Repository } from "typeorm";

@injectable()
export class ProductRepository implements IProductRepository {
    private repository: Repository<ProductEntity>;

    constructor(@inject("DataSource") dataSource: any) {
        this.repository = dataSource.getRepository(ProductEntity);
    }

    async create(product: Partial<ProductEntity>): Promise<ProductEntity> {
        const newProduct = this.repository.create(product);
        return await this.repository.save(newProduct);
    }

    async update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        await this.repository.update(id, product);
        const updatedProduct = await this.repository.findOne({
            where: { id }
        });
        if (!updatedProduct) throw new Error("Product not found");
        return updatedProduct;
    }

    async delete(id: string): Promise<void> {
        const result = await this.repository.delete(id);
        if (result.affected === 0) throw new Error("Product not found");
    }

    async findById(id: string): Promise<ProductEntity | null> {
        return await this.repository.findOne({
            where: { id }
        });
    }

    async findAll(): Promise<ProductEntity[]> {
        return await this.repository.find();
    }
}