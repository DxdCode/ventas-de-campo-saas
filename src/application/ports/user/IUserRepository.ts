import { CreateUserWithRoleDTO, UpdateUserStatusDTO } from "@application/dtos/user/UserDTO";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { TokenEntity } from "@domain/entities/auth/TokenEntity";

// Interfaz para operaciones de usuario y tokens
export interface IUserRepository {
    create(data: CreateUserWithRoleDTO): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: number): Promise<UserEntity | null>;
    addRefreshToken(userId: number, refreshToken: string, expiracion: Date): Promise<TokenEntity>;
    removeRefreshToken(refreshToken: string): Promise<void>;
    findRefreshToken(refreshToken: string): Promise<TokenEntity | null>;
    updateStatus(id: number, data: UpdateUserStatusDTO): Promise<UserEntity | null>;
    softDelete(id: number): Promise<void>;
    hardDelete(id: number): Promise<void>;
    findAll(includeInactive?: boolean): Promise<UserEntity[]>;
}
