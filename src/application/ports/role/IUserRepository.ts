import { CreateUserWithRoleDTO } from "@application/dtos/user/UserDTO";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { TokenEntity } from "@domain/entities/auth/TokenEntity";

// Interfaz para operaciones de usuario y tokens

export interface IUserRepository {
    create(data: CreateUserWithRoleDTO): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    addRefreshToken(userId: number, refreshToken: string, expiracion: Date): Promise<TokenEntity>;
    removeRefreshToken(refreshToken: string): Promise<void>;
    findRefreshToken(refreshToken: string): Promise<TokenEntity | null>;
}
