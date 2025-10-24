import { injectable, inject } from "tsyringe";
import { RoleEntity } from "@domain/entities/user/RoleEntity";
import { DataSource } from "typeorm";
import { IRoleRepository } from "@application/ports/user/IRoleRepository";

// Implementación del repositorio de roles usando TypeORM
@injectable()
export class RoleRepository implements IRoleRepository {
    private repo;

    constructor(@inject("DataSource")  private readonly dataSource: DataSource) {
        // Obtener repositorio específico para RoleEntity
        this.repo = this.dataSource.getRepository(RoleEntity);
    }

    // Busca un rol por su nombre
    async findByName(nombre: string): Promise<RoleEntity | null> {
        return await this.repo.findOne({ where: { nombre } });
    }
}
