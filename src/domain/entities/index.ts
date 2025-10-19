import { TokenEntity } from "./auth/TokenEntity";
import { RoleEntity } from "./user/RoleEntity";
import { UserEntity } from "./user/UserEntity";

// Exportacion de todas las entidades del dominio
export const entities = [
    UserEntity,
    RoleEntity,
    TokenEntity
]