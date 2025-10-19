import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

// Middleware para validar el body de la petición usando un esquema Zod
export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar body contra el esquema
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Formatear errores para enviar solo mensajes por campo
        const formattedErrors = err.issues.reduce(
          (acc: Record<string, string>, issue) => {
            const field = issue.path[0] as string;
            acc[field] = issue.message;
            return acc;
          },
          {}
        );

        // Responder con errores de validación
        return res.status(400).json({
          errors: formattedErrors,
        });
      }

      // Error inesperado
      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };
