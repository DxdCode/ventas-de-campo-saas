import { injectable, inject } from "tsyringe";
import { IUserRepository } from "@application/ports/role/IUserRepository";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@shared/utils/jwt";

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

// Servicio para manejar generación, verificación y revocación de tokens JWT
@injectable()
export class TokenService {
    private REFRESH_TOKEN_EXP_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

    constructor(@inject("IUserRepository") private userRepository: IUserRepository) { }

    // Genera y guarda tokens de acceso y refresco para el usuario
    async generateTokens(user: UserEntity) {
        if (!user.rol || !user.rol.nombre) {
            throw new Error("El usuario no tiene un rol asignado");
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.rol.nombre,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const expiracion = new Date(Date.now() + this.REFRESH_TOKEN_EXP_MS);
        await this.userRepository.addRefreshToken(user.id, refreshToken, expiracion);

        return { accessToken, refreshToken };
    }

    // Revoca (elimina) un token de refresco
    async revokeRefreshToken(token: string) {
        await this.userRepository.removeRefreshToken(token);
    }

    // Verifica un refresh token, lo renueva y genera nuevos tokens
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

        const user = tokenEntity.usuario;
        const newTokens = await this.generateTokens(user);

        await this.userRepository.removeRefreshToken(refreshToken);

        return newTokens;
    }
}
