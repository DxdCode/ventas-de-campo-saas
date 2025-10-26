import { injectable, inject } from "tsyringe";
import { IUserRepository } from "@application/ports/user/IUserRepository";
import { AuthEntity } from "@domain/entities/auth/AuthEntity";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "@shared/utils/jwt";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

@injectable()
export class TokenService {
  private REFRESH_TOKEN_EXP_MS = 7 * 24 * 60 * 60 * 1000;

  constructor(@inject("IUserRepository") private userRepository: IUserRepository) {}

  async generateTokensFromAuth(auth: AuthEntity) {
    if (!auth || !auth.email) throw new Error("Auth inválido");
    if (!auth.user || !auth.user.rol || !auth.user.rol.nombre)
      throw new Error("Usuario no tiene rol asignado");

    const payload: JwtPayload = {
      id: auth.user.id,
      email: auth.email,
      role: auth.user.rol.nombre,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const expiracion = new Date(Date.now() + this.REFRESH_TOKEN_EXP_MS);
    await this.userRepository.addRefreshToken(auth.user.id, refreshToken, expiracion);

    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(token: string) {
    await this.userRepository.removeRefreshToken(token);
  }

  async verifyAndRefresh(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = verifyRefreshToken(refreshToken) as JwtPayload;
    } catch {
      throw new Error("Refresh token inválido");
    }

    const tokenEntity = await this.userRepository.findRefreshToken(refreshToken);
    if (!tokenEntity) throw new Error("Refresh token no encontrado");

    if (tokenEntity.expiracion < new Date()) {
      await this.userRepository.removeRefreshToken(refreshToken);
      throw new Error("Refresh token expirado");
    }

    const auth = tokenEntity.usuario.auth;
    return this.generateTokensFromAuth(auth);
  }

  // Nueva función para verificar accessToken sin refreshToken
  verifyAccessToken(token: string): JwtPayload {
    return verifyAccessToken(token) as JwtPayload;
  }
}
