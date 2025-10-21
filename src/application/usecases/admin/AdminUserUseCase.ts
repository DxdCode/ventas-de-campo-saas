import { injectable, inject } from "tsyringe";
import { IUserRepository } from "@application/ports/role/IUserRepository";
import { IRoleRepository } from "@application/ports/user/IRoleRepository";
import { CreateUserWithRoleDTO, UpdateUserStatusDTO, UserResponseDTO } from "@application/dtos/user/UserDTO";
import { hashPassword } from "@shared/utils/hash";

@injectable()
export class AdminUserUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("IRoleRepository") private roleRepository: IRoleRepository
    ) {}

    // Crear usuario con rol (acción de administrador)
    async createUser(data: CreateUserWithRoleDTO): Promise<UserResponseDTO> {
        // Verificar si el rol existe
        const role = await this.roleRepository.findByName(data.rol.nombre);
        if (!role) throw new Error("Rol no encontrado");

        // Verificar si el usuario ya existe
        const existUser = await this.userRepository.findByEmail(data.email);
        if (existUser)
            throw new Error(`El usuario con email ${data.email} ya existe con el nombre ${existUser.name} y ID ${existUser.id}`);

        // Hashear la contraseña
        const hashedPassword = await hashPassword(data.password);

        // Crear usuario
        const newUser = await this.userRepository.create({
            ...data,
            password: hashedPassword,
            rol: role
        });

        // Retornar como UserResponseDTO
        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isActive: newUser.isActive,
            rol: newUser.rol,
            deletedAt: newUser.deletedAt
        };
    }

    // Listar todos los usuarios
    async getAllUsers(includeInactive: boolean = false): Promise<UserResponseDTO[]> {
        const users = await this.userRepository.findAll(includeInactive);
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            rol: user.rol,
            deletedAt: user.deletedAt
        }));
    }

    // Actualizar estado de usuario
    async updateUserStatus(userId: number, data: UpdateUserStatusDTO): Promise<UserResponseDTO | null> {
        const updatedUser = await this.userRepository.updateStatus(userId, data);
        if (!updatedUser) return null;

        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isActive: updatedUser.isActive,
            rol: updatedUser.rol,
            deletedAt: updatedUser.deletedAt
        };
    }

    // Borrado lógico
    async softDeleteUser(userId: number): Promise<void> {
        await this.userRepository.softDelete(userId);
    }

    // Borrado físico
    async hardDeleteUser(userId: number): Promise<void> {
        await this.userRepository.hardDelete(userId);
    }

    // Obtener usuario por ID
    async getUserById(userId: number): Promise<UserResponseDTO | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) return null;
        return {
            id: user.id,
            name: user.name,   
            email: user.email,
            isActive: user.isActive,
            rol: user.rol,
            deletedAt: user.deletedAt
        };
    }
}
