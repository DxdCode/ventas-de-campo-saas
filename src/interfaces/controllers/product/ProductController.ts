import { ProductUseCase } from "@application/usecases/product/ProductUseCase";
import { createProductSchema, updateProductSchema } from "@interfaces/validators/product/ProductValidator";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class ProductController {
    private productUseCase: ProductUseCase;

    constructor() {
        this.productUseCase = container.resolve(ProductUseCase);
    }

    createProduct = async (req: Request, res: Response) => {
        try {
            const validatedData = createProductSchema.parse(req.body);
            const product = await this.productUseCase.createProduct(validatedData);
            return res.status(201).json(product);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    updateProduct = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const validatedData = updateProductSchema.parse(req.body);
            const product = await this.productUseCase.updateProduct(id, validatedData);
            return res.json(product);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    deleteProduct = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.productUseCase.deleteProduct(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    getAllProducts = async (_req: Request, res: Response) => {
        try {
            const products = await this.productUseCase.getAllProducts();
            return res.json(products);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    getProductById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const product = await this.productUseCase.getProductById(id);
            return res.json(product);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };
}