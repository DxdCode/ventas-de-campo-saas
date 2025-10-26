import "reflect-metadata";
import { container } from "tsyringe";
import { IUserRepository } from "@application/ports/user/IUserRepository";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";
import { IRoleRepository } from "@application/ports/role/IRoleRepository";
import { RoleRepository } from "./repositories/role/RoleRepository";

import { RegisterUserUseCase } from "@application/usecases/auth/RegisterUserUseCase";
import { LoginUserUseCase } from "@application/usecases/auth/LoginUserUseCase";

import { TokenService } from "@infrastructure/services/TokenService";
import { AppDataSource } from "config";
import { AdminUserUseCase } from "@application/usecases/admin/AdminUserUseCase";
import { IRouteRepository } from "@application/ports/route/IRouteRepository";
import { RouteRepository } from "./repositories/route/RouteRepository";
import { RouteUseCase } from "@application/usecases/route/RouteUseCase";

import { IProductRepository } from "@application/ports/product/IProductRepository";
import { ProductRepository } from "./repositories/product/ProductRepository";
import { ProductUseCase } from "@application/usecases/product/ProductUseCase";

import { AuthRepository } from "@infrastructure/repositories/auth/AuthRepository";
import { IAuthRepository } from "@application/ports/user/IAuthRepository";

// Registro de la instancia de la fuente de datos para inyección
container.registerInstance("DataSource", AppDataSource);

// Registro de implementaciones concretas para interfaces
container.register<IUserRepository>("IUserRepository", {
    useClass: UserRepository,
});

container.register<IRoleRepository>("IRoleRepository", {
    useClass: RoleRepository,
});


// Registro de AuthRepository
container.register("AuthRepository", { useClass: AuthRepository });

// Registro de casos de uso
container.register(RegisterUserUseCase, {
    useClass: RegisterUserUseCase,
});

container.register(LoginUserUseCase, {
    useClass: LoginUserUseCase,
});

container.register(AdminUserUseCase,{
    useClass: AdminUserUseCase,
});

// Registro del repositorio de rutas y su caso de uso
container.register<IRouteRepository>("IRouteRepository", {
    useClass: RouteRepository,
});

container.register(RouteUseCase, {
    useClass: RouteUseCase,
});

// Registro del repositorio de productos y su caso de uso
container.register<IProductRepository>("IProductRepository", {
    useClass: ProductRepository,
});

container.register(ProductUseCase, {
    useClass: ProductUseCase,
});


// Registro singleton para el servicio de tokens
container.registerSingleton(TokenService);

