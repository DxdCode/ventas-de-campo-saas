import { injectable, inject } from "tsyringe";
import { IRouteRepository } from "@application/ports/route/IRouteRepository";
import { RouteEntity } from "@domain/entities/route/RouteEntity";
import { UpdateRouteDTO , CreateRouteDTO, AssignUsersToRouteDTO } from "@application/dtos/route/RouteDTO";

@injectable()
export class RouteUseCase {
    constructor(
        @inject("IRouteRepository") private routeRepository: IRouteRepository
    ) {}

    async createRoute(dto: CreateRouteDTO): Promise<RouteEntity> {
        return await this.routeRepository.create({
            name: dto.name,
            description: dto.description,
            status: dto.status ?? true
        });
    }

    async updateRoute(id: string, dto: UpdateRouteDTO): Promise<RouteEntity> {
        const existingRoute = await this.routeRepository.findById(id);
        if (!existingRoute) {
            throw new Error("Ruta no encontrada");
        }

        return await this.routeRepository.update(id, dto);
    }

    async assignUsersToRoute(id: string, dto: AssignUsersToRouteDTO): Promise<RouteEntity> {
        const existingRoute = await this.routeRepository.findById(id);
        if (!existingRoute) {
            throw new Error("Ruta no encontrada");
        }

        return await this.routeRepository.assignUsers(id, dto.userIds);
    }

    async getAllRoutes(): Promise<RouteEntity[]> {
        return await this.routeRepository.findAll();
    }

    async getRouteById(id: string): Promise<RouteEntity> {
        const route = await this.routeRepository.findById(id);
        if (!route) {
            throw new Error("Ruta no encontrada");
        }
        return route;
    }
}