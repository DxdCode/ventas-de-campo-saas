import { CreateUserWithRoleDTO } from "@application/dtos/user/UserDTO";
import { TokenEntity } from "@domain/entities/auth/TokenEntity";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { AppDataSource } from "config";

export class UserRepository {
    // Crear usuario
    async create(data: CreateUserWithRoleDTO): Promise<UserEntity> {
        const repo = AppDataSource.getRepository(UserEntity);
        const user = repo.create(data)
        return await repo.save(user);
    }

    // Buscar usuario por email
    async findByEmail(email: string): Promise<UserEntity | null> {
        const repo = AppDataSource.getRepository(UserEntity);
        return await repo.findOne({ where: { email } })
    }

    // Guardar un refresh token para un usuario
    async addRefreshToken(userId: number, refreshToken: string, expiracion: Date): Promise<TokenEntity> {
        const tokenRepo = AppDataSource.getRepository(TokenEntity);

        const token = tokenRepo.create({
            refreshToken,
            expiracion,
            usuario: { id: userId }, 
        });

        return await tokenRepo.save(token);
    }

    // Eliminar un refresh token 
    async removeRefreshToken(refreshToken: string): Promise<void> {
        const tokenRepo = AppDataSource.getRepository(TokenEntity);
        await tokenRepo.delete({ refreshToken });
    }

    // Buscar refresh token en DB
    async findRefreshToken(refreshToken: string): Promise<TokenEntity | null> {
        const tokenRepo = AppDataSource.getRepository(TokenEntity);
        return await tokenRepo.findOne({ where: { refreshToken }});
    }

}