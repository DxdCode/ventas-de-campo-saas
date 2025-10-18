import { Repository } from "typeorm";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@shared/utils/jwt";
import { TokenEntity } from "@domain/entities/auth/TokenEntity";
import { UserEntity } from "@domain/entities/user/UserEntity";

export class TokenService {
    constructor(private tokenRepository: Repository<TokenEntity>) { }

    async generateTokens(user: UserEntity) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.rol.nombre,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Guardar refresh token en BD
        const tokenEntity = new TokenEntity();
        tokenEntity.refreshToken = refreshToken;
        tokenEntity.expiracion = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        tokenEntity.usuario = user;

        await this.tokenRepository.save(tokenEntity);

        return { accessToken, refreshToken };
    }

    async revokeRefreshToken(token: string) {
        await this.tokenRepository.delete({ refreshToken: token });
    }

    async verifyAndRefresh(refreshToken: string) {
        try {
            // Verificar JWT y obtener payload
            const payload: any = verifyRefreshToken(refreshToken);

            // Buscar token en base para validar que existe y no expiró
            const tokenEntity = await this.tokenRepository.findOne({
                where: { refreshToken },
                relations: ["usuario", "usuario.rol"],
            });

            if (!tokenEntity) throw new Error("Refresh token inválido");

            if (tokenEntity.expiracion < new Date()) {
                await this.tokenRepository.delete({ id: tokenEntity.id });
                throw new Error("Refresh token expirado");
            }

            // Generar nuevos tokens
            const user = tokenEntity.usuario;
            const newTokens = await this.generateTokens(user);

            // Eliminar token viejo
            await this.tokenRepository.delete({ id: tokenEntity.id });

            return newTokens;
        } catch (error) {
            throw new Error("Refresh token inválido o expirado");
        }
    }
}
