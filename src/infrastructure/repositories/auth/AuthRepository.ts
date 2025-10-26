import { injectable, inject } from "tsyringe";
import { Repository } from "typeorm";
import { AuthEntity } from "../../../domain/entities/auth/AuthEntity";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { IAuthRepository } from "@application/ports/user/IAuthRepository";

@injectable()
export class AuthRepository implements IAuthRepository {
    private repository: Repository<AuthEntity>;

    constructor(@inject("DataSource") dataSource: any) {
        this.repository = dataSource.getRepository(AuthEntity);
    }

    async create(data: { user: UserEntity; email: string; password: string }): Promise<AuthEntity> {
        const auth = this.repository.create({
            user: data.user,
            email: data.email,
            password: data.password
        });
        return await this.repository.save(auth);
    }

    async findByEmail(email: string): Promise<AuthEntity | null> {
        return await this.repository.findOne({
            where: { email },
            relations: ["user"]
        });
    }

    async updateLastLogin(authId: number): Promise<void> {
        await this.repository.update(authId, {
            lastLoginAt: new Date()
        });
    }

    async deleteByUserId(userId: number): Promise<void> {
        await this.repository.delete({ user: { id: userId } });
    }
}
