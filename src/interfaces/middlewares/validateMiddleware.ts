import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.reduce(
          (acc: Record<string, string>, issue) => {
            const field = issue.path[0] as string;
            acc[field] = issue.message;
            return acc;
          },
          {}
        );

        return res.status(400).json({
          errors: formattedErrors,
        });
      }

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };
