import { injectable, inject } from "tsyringe";
import { CreateUserDTO } from "@application/dtos/user/UserDTO";
import { hashPassword } from "@shared/utils/hash";
import { IUserRepository } from "@application/ports/role/IUserRepository";
import { IRoleRepository } from "@application/ports/user/IRoleRepository";

// Caso de uso para registrar un nuevo usuario con rol por defecto "cliente"
@injectable()
export class RegisterUserUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("IRoleRepository") private roleRepository: IRoleRepository
    ) { }

    async execute(data: CreateUserDTO) {
        // Verificar que el email no esté registrado
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) throw new Error("Email ya registrado");

        // Encriptar la contraseña
        const hashedPassword = await hashPassword(data.password);

        // Obtener el rol "cliente"
        const userRole = await this.roleRepository.findByName("cliente");
        if (!userRole) throw new Error("Rol 'cliente' no encontrado");

        // Crear el usuario con la contraseña encriptada y el rol asignado
        return await this.userRepository.create({
            ...data,
            password: hashedPassword,
            rol: userRole,
        });
    }
}
