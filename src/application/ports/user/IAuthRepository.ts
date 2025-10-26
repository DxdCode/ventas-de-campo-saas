import { AuthEntity } from "@domain/entities/auth/AuthEntity";
import { UserEntity } from "@domain/entities/user/UserEntity";

export interface IAuthRepository {
    findByEmail(email: string): Promise<AuthEntity | null>;
    create(data: { user: UserEntity; email: string; password: string }): Promise<AuthEntity>;
    updateLastLogin(authId: number): Promise<void>;
    deleteByUserId(userId: number): Promise<void>;
}