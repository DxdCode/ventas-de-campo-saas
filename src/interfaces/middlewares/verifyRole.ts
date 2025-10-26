import { NextFunction, Request, Response } from "express";

export function checkRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(403).json({
          message: "Acceso denegado: Usuario no autenticado.",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Acceso denegado: No tienes el rol adecuado.",
        });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: "Error al verificar permisos." });
    }
  };
}
