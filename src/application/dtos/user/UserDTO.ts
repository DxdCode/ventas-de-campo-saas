import { RoleEntity } from "@domain/entities/user/RoleEntity";

export interface CreateUserDTO{
    name: string;
    email: string;
    password: string;
}

export interface CreateUserWithRoleDTO extends CreateUserDTO{
    rol: RoleEntity
}