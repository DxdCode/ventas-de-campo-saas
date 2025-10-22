import { z } from "zod";

export const createRouteSchema = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .nonempty("El nombre es requerido"),
    description: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .nonempty("La descripción es requerida"),
    status: z.boolean().optional().default(true)
});

export const updateRouteSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").optional(),
    status: z.boolean().optional()
});

export const assignUsersSchema = z.object({
    userIds: z.array(z.string().uuid("ID de usuario inválido"))
        .min(1, "Se requiere al menos un usuario")
        .describe("Array de IDs de usuarios a asignar")
});