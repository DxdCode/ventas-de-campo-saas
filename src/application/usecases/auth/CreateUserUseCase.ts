import { CreateUserDTO } from "@application/dtos/user/UserDTO";
import { RoleEntity } from "@domain/entities/user/RoleEntity";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";
import { hashPassword } from "@shared/utils/hash";
import { AppDataSource } from "config";

export class RegisterUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(data: CreateUserDTO) {

        // Verificamos el correo
        const existingUser = await this.userRepository.findByEmail(data.email)
        if (existingUser) throw new Error("Email ya se encuentra registrado");

        // Hasheamos la contraseña
        const hashedPassword = await hashPassword(data.password);

        // Rol

        const roleRepo = AppDataSource.getRepository(RoleEntity)
        let userRole = await roleRepo.findOne({ where: { nombre: "cliente" } });

        if (!userRole) {
            throw new Error("Rol 'user' no encontrado en la base de datos");
        }
        //
        return await this.userRepository.create({
            ...data,
            password: hashedPassword,
            rol: userRole
        })

    }
}