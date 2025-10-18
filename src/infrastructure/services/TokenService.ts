import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@shared/utils/jwt";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";

interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

export class TokenService {
    private REFRESH_TOKEN_EXP_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

    constructor(private userRepository: UserRepository) {}

    // Genera access y refresh tokens para un usuario y guarda el refresh token en DB
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

        // Guardar refresh token usando UserRepository
        const expiracion = new Date(Date.now() + this.REFRESH_TOKEN_EXP_MS);
        await this.userRepository.addRefreshToken(user.id, refreshToken, expiracion);

        return { accessToken, refreshToken };
    }

    // Revocar refresh token
    async revokeRefreshToken(token: string) {
        await this.userRepository.removeRefreshToken(token);
    }

    // Verifica refresh token y genera nuevos tokens
    async verifyAndRefresh(refreshToken: string) {
        let payload: JwtPayload;

        try {
            payload = verifyRefreshToken(refreshToken) as JwtPayload;
        } catch {
            throw new Error("Refresh token inválido");
        }

        // Buscar token en DB usando UserRepository
        const tokenEntity = await this.userRepository.findRefreshToken(refreshToken);
        if (!tokenEntity) throw new Error("Refresh token no encontrado");

        if (tokenEntity.expiracion < new Date()) {
            await this.userRepository.removeRefreshToken(refreshToken);
            throw new Error("Refresh token expirado");
        }

        const user = tokenEntity.usuario;
        const newTokens = await this.generateTokens(user);

        // Eliminar token viejo
        await this.userRepository.removeRefreshToken(refreshToken);

        return newTokens;
    }
}
