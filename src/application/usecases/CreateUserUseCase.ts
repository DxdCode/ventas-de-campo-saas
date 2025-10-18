import { CreateUserDTO } from "@application/dtos/user/UserDTO";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";
import { hashPassword } from "@shared/utils/hash";

export class RegisterUserUseCase {
    constructor(private userRepository: UserRepository){}

    async execute(data: CreateUserDTO){
        const existingUser = await this.userRepository.findByEmail(data.email)
        if(existingUser) throw new Error("Email ya se encuentra registrado");

        const hashedPassword = await hashPassword(data.password);

        return await this.userRepository.create({
            ...data,
            password: hashedPassword,
        })

    }
}