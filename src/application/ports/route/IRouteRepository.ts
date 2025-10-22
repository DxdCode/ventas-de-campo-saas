import { RouteEntity } from "@domain/entities/route/RouteEntity";

export interface IRouteRepository {
    create(route: Partial<RouteEntity>): Promise<RouteEntity>;
    update(id: string, route: Partial<RouteEntity>): Promise<RouteEntity>;
    findById(id: string): Promise<RouteEntity | null>;
    findAll(): Promise<RouteEntity[]>;
    assignUsers(id: string, userIds: string[]): Promise<RouteEntity>;
}