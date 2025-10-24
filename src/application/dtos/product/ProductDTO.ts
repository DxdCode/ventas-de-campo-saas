export class CreateProductDTO {
    name!: string;
    description!: string;
    price!: number;
    sku!: string;
    stock!: number;
    status?: boolean;
}

export class UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    sku?: string;
    stock?: number;
    status?: boolean;
}