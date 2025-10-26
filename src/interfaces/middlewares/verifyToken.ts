import { JwtPayload } from "@infrastructure/services/TokenService";
import { verifyAccessToken } from "@shared/utils/jwt";
import { NextFunction, Request, Response } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(403).json({ 
            message: "Acceso denegado: No se proporcionó el token." 
        });
    }

    try {
        const decoded = verifyAccessToken(token) as JwtPayload;
        req.user = { 
            id: decoded.id, 
            email: decoded.email, 
            role: decoded.role 
        };
        next();
    } catch (err) {
        return res.status(403).json({ 
            message: "Token inválido o expirado." 
        });
    }
};