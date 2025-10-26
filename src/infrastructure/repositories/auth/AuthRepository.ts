import { injectable, inject } from "tsyringe";
import { Repository } from "typeorm";
import { AuthEntity } from "../../../domain/entities/auth/AuthEntity";

@injectable()
export class AuthRepository {
    private repository: Repository<AuthEntity>;

    constructor(@inject("DataSource") dataSource: any) {
        this.repository = dataSource.getRepository(AuthEntity);
    }

    async create(data: Partial<AuthEntity>): Promise<AuthEntity> {
        const auth = this.repository.create(data);
        return await this.repository.save(auth);
    }

    async findByEmail(email: string): Promise<AuthEntity | null> {
        return await this.repository.findOne({ 
            where: { email }
        });
    }

    async updateLastLogin(id: number): Promise<void> {
        await this.repository.update(id, {
            lastLoginAt: new Date()
        });
    }
}