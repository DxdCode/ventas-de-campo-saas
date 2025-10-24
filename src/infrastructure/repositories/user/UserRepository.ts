import { injectable, inject } from "tsyringe";
import { DataSource } from "typeorm";
import { CreateUserWithRoleDTO, UpdateUserStatusDTO } from "@application/dtos/user/UserDTO";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { TokenEntity } from "@domain/entities/auth/TokenEntity";
import { IUserRepository } from "@application/ports/role/IUserRepository";

// Implementación del repositorio de usuarios y tokens usando TypeORM
@injectable()
export class UserRepository implements IUserRepository {
    private userRepo;
    private tokenRepo;

    constructor(@inject("DataSource") private readonly dataSource: DataSource) {
        this.userRepo = this.dataSource.getRepository(UserEntity);
        this.tokenRepo = this.dataSource.getRepository(TokenEntity);
    }

    // Crea y guarda un nuevo usuario con rol
    async create(data: CreateUserWithRoleDTO): Promise<UserEntity> {
        const user = this.userRepo.create(data);
        return await this.userRepo.save(user);
    }

    // Busca un usuario por email
    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepo.findOne({ where: { email } });
    }

    async findById(id: number): Promise<UserEntity | null> {
        return await this.userRepo.findOne({ where: { id } });
    }

    async updateStatus(id: number, data: UpdateUserStatusDTO): Promise<UserEntity | null> {
        await this.userRepo.update(id, data);
        return this.findById(id);
    }

    async softDelete(id: number): Promise<void> {
        await this.userRepo.softDelete(id);
    }

    async hardDelete(id: number): Promise<void> {
        await this.tokenRepo.delete({ usuario: { id } });
        await this.userRepo.delete(id);
    }

    async findAll(includeInactive: boolean = false): Promise<UserEntity[]> {
        if (includeInactive) {
            return await this.userRepo.find({
                withDeleted: true
            });
        }
        return await this.userRepo.find({
            where: { isActive: true }
        });
    }

    // Agrega un token de refresco para un usuario con fecha de expiración
    async addRefreshToken(userId: number, refreshToken: string, expiracion: Date): Promise<TokenEntity> {
        const token = this.tokenRepo.create({
            refreshToken,
            expiracion,
            usuario: { id: userId },
        });
        return await this.tokenRepo.save(token);
    }

    // Elimina un token de refresco específico
    async removeRefreshToken(refreshToken: string): Promise<void> {
        await this.tokenRepo.delete({ refreshToken });
    }

    // Busca un token de refresco por valor
    async findRefreshToken(refreshToken: string): Promise<TokenEntity | null> {
        return await this.tokenRepo.findOne({ where: { refreshToken } });
    }
}
