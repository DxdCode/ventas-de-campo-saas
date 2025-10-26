import { injectable, inject } from "tsyringe";
import { CreateUserDTO } from "@application/dtos/user/UserDTO";
import { hashPassword } from "@shared/utils/hash";
import { IUserRepository } from "@application/ports/user/IUserRepository";
import { IRoleRepository } from "@application/ports/role/IRoleRepository";
import { AuthRepository } from "@infrastructure/repositories/auth/AuthRepository";

// Caso de uso para registrar un nuevo usuario con rol por defecto "cliente"
@injectable()
export class RegisterUserUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("IRoleRepository") private roleRepository: IRoleRepository,
        @inject(AuthRepository) private authRepository: AuthRepository
    ) { }

    async execute(data: CreateUserDTO) {
        // Verificar que el email no esté registrado
        const existingAuth = await this.authRepository.findByEmail(data.email);
        if (existingAuth) throw new Error("Email ya registrado");

        // Encriptar la contraseña
        const hashedPassword = await hashPassword(data.password);

        // Obtener el rol "cliente"
        const userRole = await this.roleRepository.findByName("cliente");
        if (!userRole) throw new Error("Rol 'cliente' no encontrado");

        // Crear el usuario primero
        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            rol: userRole
        });

        // Crear la entrada de autenticación
        await this.authRepository.create({
            user,
            email: data.email,
            password: hashedPassword
        });

        return user;
    }
}
