import { RoleEntity } from "@domain/entities/user/RoleEntity";

// Interfaz para operaciones relacionadas con roles de usuario

export interface IRoleRepository {
    findByName(nombre: string): Promise<RoleEntity | null>;
}
