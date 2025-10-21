import { RoleEntity } from "@domain/entities/user/RoleEntity";

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface CreateUserWithRoleDTO extends CreateUserDTO {
    rol: RoleEntity;
}

export interface UpdateUserStatusDTO {
    isActive: boolean;
}

export interface UserResponseDTO {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    rol: RoleEntity;
    deletedAt?: Date;
}