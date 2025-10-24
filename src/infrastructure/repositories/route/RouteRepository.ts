import { IRouteRepository } from "@application/ports/route/IRouteRepository";
import { RouteEntity } from "@domain/entities/route/RouteEntity";
import { injectable, inject } from "tsyringe";
import { Repository, DataSource } from "typeorm";

@injectable()
export class RouteRepository implements IRouteRepository {
    private repository: Repository<RouteEntity>;

    constructor(
        @inject("DataSource") private readonly dataSource: DataSource
    ) {
        this.repository = this.dataSource.getRepository(RouteEntity);
    }

    async create(route: Partial<RouteEntity>): Promise<RouteEntity> {
        const newRoute = this.repository.create(route);
        return await this.repository.save(newRoute);
    }

    async update(id: string, route: Partial<RouteEntity>): Promise<RouteEntity> {
        await this.repository.update(id, route);
        const updatedRoute = await this.repository.findOne({ where: { id } });

        if (!updatedRoute) {
            throw new Error("Ruta no encontrada");
        }

        return updatedRoute;
    }

    async findById(id: string): Promise<RouteEntity | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<RouteEntity[]> {
        return await this.repository.find();
    }

    async assignUsers(id: string, userIds: string[]): Promise<RouteEntity> {
        const route = await this.repository.findOne({ where: { id } });

        if (!route) {
            throw new Error("Ruta no encontrada");
        }

        route.assignedUsers = [];
        await this.repository.save(route);
        return await this.update(id, {
            assignedUsers: userIds.map(userId => ({ id: userId } as any))
        });
    }
}
