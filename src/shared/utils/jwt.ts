import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

// Genera un token de acceso (15 minutos)
export function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

// Genera un token de refresco (7 días)
export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

// Verifica un token de acceso, manejando expiración o invalidez
export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("ACCESS_TOKEN_EXPIRED");
    }
    throw new Error("ACCESS_TOKEN_INVALID");
  }
}

// Verifica un token de refresco, manejando errores
export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }
    throw new Error("REFRESH_TOKEN_INVALID");
  }
}
