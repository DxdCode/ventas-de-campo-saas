import { injectable, inject } from "tsyringe";
import { IUserRepository } from "@application/ports/user/IUserRepository";
import { IRoleRepository } from "@application/ports/role/IRoleRepository";
import { CreateUserWithRoleDTO, UpdateUserStatusDTO, UserResponseDTO } from "@application/dtos/user/UserDTO";
import { hashPassword } from "@shared/utils/hash";
import { IAuthRepository } from "@application/ports/user/IAuthRepository";

@injectable()
export class AdminUserUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("IRoleRepository") private roleRepository: IRoleRepository,
        @inject("AuthRepository") private authRepository: IAuthRepository
    ) { }

    // Crear usuario con rol
    async createUser(data: CreateUserWithRoleDTO): Promise<UserResponseDTO> {
        const role = await this.roleRepository.findByName(data.rol.nombre);
        if (!role) throw new Error("Rol no encontrado");

        const existingAuth = await this.authRepository.findByEmail(data.email);
        if (existingAuth) throw new Error(`El email ${data.email} ya está registrado.`);

        const hashedPassword = await hashPassword(data.password);

        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            rol: role,
        });

        await this.authRepository.create({
            user,
            email: data.email,
            password: hashedPassword
        });

        return {
            id: user.id,
            name: user.name,
            email: data.email,
            isActive: user.isActive,
            rol: user.rol,
            deletedAt: user.deletedAt
        };
    }

    // Listar todos los usuarios
    async getAllUsers(includeInactive: boolean = false): Promise<UserResponseDTO[]> {
        const users = await this.userRepository.findAll(includeInactive);
        const filteredUsers = users.filter(user => user.rol.nombre !== "administrador");

        return filteredUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.auth?.email ?? "",
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
            email: updatedUser.auth?.email ?? "",
            isActive: updatedUser.isActive,
            rol: updatedUser.rol,
            deletedAt: updatedUser.deletedAt
        };
    }

    // Borrado lógico
    async softDeleteUser(userId: number): Promise<void> {
        await this.userRepository.softDelete(userId);
    }

    // Borrado físico seguro
    async hardDeleteUser(userId: number): Promise<void> {
        await this.authRepository.deleteByUserId(userId);
        await this.userRepository.hardDelete(userId);
    }

    // Obtener usuario por ID
    async getUserById(userId: number): Promise<UserResponseDTO | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) return null;
        return {
            id: user.id,
            name: user.name,
            email: user.auth?.email ?? "",
            isActive: user.isActive,
            rol: user.rol,
            deletedAt: user.deletedAt
        };
    }
}
