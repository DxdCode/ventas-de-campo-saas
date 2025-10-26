import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { TokenService, JwtPayload } from "@infrastructure/services/TokenService";

const tokenService = container.resolve(TokenService);

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return res.status(403).json({ message: "Acceso denegado: No se encontró el access token" });
    }

    try {
      // Intentamos verificar el accessToken
      const decoded = tokenService.verifyAccessToken(accessToken) as JwtPayload;
      req.user = decoded;
      return next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        const { refreshToken } = req.body;
        if (!refreshToken) {
          return res.status(403).json({ message: "Access token expirado y no hay refreshToken" });
        }

        const tokens = await tokenService.verifyAndRefresh(refreshToken);

        const decoded = tokenService.verifyAccessToken(tokens.accessToken) as JwtPayload;
        req.user = decoded;

        res.setHeader("x-access-token", tokens.accessToken);
        res.setHeader("x-refresh-token", tokens.refreshToken);

        return next();
      }
      throw err;
    }
  } catch (error: any) {
    console.error("Error al verificar token:", error);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
