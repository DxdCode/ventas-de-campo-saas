import { injectable, inject } from "tsyringe";
import { DataSource } from "typeorm";
import { CreateUserWithRoleDTO, UpdateUserStatusDTO } from "@application/dtos/user/UserDTO";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { TokenEntity } from "@domain/entities/auth/TokenEntity";
import { IUserRepository } from "@application/ports/user/IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
    private userRepo;
    private tokenRepo;

    constructor(@inject("DataSource") private readonly dataSource: DataSource) {
        this.userRepo = this.dataSource.getRepository(UserEntity);
        this.tokenRepo = this.dataSource.getRepository(TokenEntity);
    }

    async create(data: CreateUserWithRoleDTO): Promise<UserEntity> {
        const user = this.userRepo.create(data);
        return await this.userRepo.save(user);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findOne({
            where: { auth: { email } },
            relations: { auth: true, rol: true }
        });
        return user;
    }

    async findById(id: number, includeRelations: boolean = true): Promise<UserEntity | null> {
        if (includeRelations) {
            return await this.userRepo.findOne({
                where: { id },
                relations: { auth: true, rol: true }
            });
        }
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
                withDeleted: true,
                relations: { auth: true, rol: true } // cargamos relaciones
            });
        }
        return await this.userRepo.find({
            where: { isActive: true },
            relations: { auth: true, rol: true } // cargamos relaciones
        });
    }

    async addRefreshToken(userId: number, refreshToken: string, expiracion: Date): Promise<TokenEntity> {
        const token = this.tokenRepo.create({
            refreshToken,
            expiracion,
            usuario: { id: userId },
        });
        return await this.tokenRepo.save(token);
    }

    async removeRefreshToken(refreshToken: string): Promise<void> {
        await this.tokenRepo.delete({ refreshToken });
    }

    async findRefreshToken(refreshToken: string): Promise<TokenEntity | null> {
        const tokenEntity = await this.tokenRepo.findOne({
            where: { refreshToken },
            relations: { usuario: { auth: true, rol: true } }
        });
        return tokenEntity;
    }
}
