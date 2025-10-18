import { CreateUserDTO } from "@application/dtos/user/UserDTO";
import { UserEntity } from "@domain/entities/user/UserEntity";
import { AppDataSource } from "config";

export class UserRepository {
    async create(data: CreateUserDTO): Promise<UserEntity>{
        const repo = AppDataSource.getRepository(UserEntity);
        const user = repo.create(data)
        return await repo.save(user);

    }

    async findByEmail(email:string): Promise<UserEntity | null>{
        const repo = AppDataSource.getRepository(UserEntity);
        return await repo.findOne({where:{email}})
    }
}