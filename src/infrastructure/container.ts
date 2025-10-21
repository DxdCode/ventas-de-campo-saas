import "reflect-metadata";
import { container } from "tsyringe";
import { IUserRepository } from "@application/ports/role/IUserRepository";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";
import { IRoleRepository } from "@application/ports/user/IRoleRepository";
import { RoleRepository } from "./repositories/role/RoleRepository";

import { RegisterUserUseCase } from "@application/usecases/auth/RegisterUserUseCase";
import { LoginUserUseCase } from "@application/usecases/auth/LoginUserUseCase";

import { TokenService } from "@infrastructure/services/TokenService";
import { AppDataSource } from "config";
import { AdminUserUseCase } from "@application/usecases/admin/AdminUserUseCase";

// Registro de la instancia de la fuente de datos para inyección
container.registerInstance("DataSource", AppDataSource);

// Registro de implementaciones concretas para interfaces
container.register<IUserRepository>("IUserRepository", {
    useClass: UserRepository,
});

container.register<IRoleRepository>("IRoleRepository", {
    useClass: RoleRepository,
});

// Registro de casos de uso
container.register(RegisterUserUseCase, {
    useClass: RegisterUserUseCase,
});

container.register(LoginUserUseCase, {
    useClass: LoginUserUseCase,
});

container.register(AdminUserUseCase,{
    useClass: AdminUserUseCase,
})
// Registro singleton para el servicio de tokens
container.registerSingleton(TokenService);

