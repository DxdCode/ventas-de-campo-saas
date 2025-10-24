import { CreateProductDTO, UpdateProductDTO } from "@application/dtos/product/ProductDTO";
import { IProductRepository } from "@application/ports/product/IProductRepository";
import { ProductEntity } from "@domain/entities/product/ProductEntity";
import { injectable, inject } from "tsyringe";

@injectable()
export class ProductUseCase {
    constructor(
        @inject("IProductRepository")
        private productRepository: IProductRepository
    ) {}

    async createProduct(dto: CreateProductDTO): Promise<ProductEntity> {
        return await this.productRepository.create(dto);
    }

    async updateProduct(id: string, dto: UpdateProductDTO): Promise<ProductEntity> {
        const existingProduct = await this.productRepository.findById(id);
        if (!existingProduct) {
            throw new Error("Product not found");
        }
        return await this.productRepository.update(id, dto);
    }

    async deleteProduct(id: string): Promise<void> {
        const existingProduct = await this.productRepository.findById(id);
        if (!existingProduct) {
            throw new Error("Product not found");
        }
        await this.productRepository.delete(id);
    }

    async getAllProducts(): Promise<ProductEntity[]> {
        return await this.productRepository.findAll();
    }

    async getProductById(id: string): Promise<ProductEntity> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
}