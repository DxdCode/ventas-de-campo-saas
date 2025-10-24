import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .nonempty("El nombre es requerido"),
    description: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .nonempty("La descripción es requerida"),
    price: z.number()
        .min(0, "El precio no puede ser negativo")
        .nonnegative("El precio debe ser un número positivo"),
    sku: z.string()
        .min(3, "El SKU debe tener al menos 3 caracteres")
        .nonempty("El SKU es requerido"),
    stock: z.number()
        .int("El stock debe ser un número entero")
        .min(0, "El stock no puede ser negativo"),
    status: z.boolean().optional().default(true)
});

export const updateProductSchema = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .optional(),
    description: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .optional(),
    price: z.number()
        .min(0, "El precio no puede ser negativo")
        .nonnegative("El precio debe ser un número positivo")
        .optional(),
    sku: z.string()
        .min(3, "El SKU debe tener al menos 3 caracteres")
        .optional(),
    stock: z.number()
        .int("El stock debe ser un número entero")
        .min(0, "El stock no puede ser negativo")
        .optional(),
    status: z.boolean().optional()
});