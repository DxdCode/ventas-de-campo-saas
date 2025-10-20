import { CreateUserWithRoleDTO } from "@application/dtos/user/UserDTO";
import { IUserRepository } from "@application/ports/role/IUserRepository";
import { IRoleRepository } from "@application/ports/user/IRoleRepository";
import { hashPassword } from "@shared/utils/hash";
import { inject, injectable } from "tsyringe";

// Caso de uso para que un adminsitrador cree usuarios con roles especificos
@injectable()
export class AdminUserUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("IRoleRepository") private roleRepository: IRoleRepository
    ) { }
        
    async execute(data: CreateUserWithRoleDTO){
        
        // Verificar si el rol existe
        const role = await this.roleRepository.findByName(data.rol.nombre);
        if(!role) throw new Error("Rol no encontrado");
        
        // Verificar si el usuario ya existe 
        const existUser = await this.userRepository.findByEmail(data.email);
        if(existUser) throw new Error(`El usuario con email ${data.email} ya existe con el nombre de ${existUser.name} con el ID ${existUser.id}`)

        // Crear el usuario con el rol asignado
        const hashedPassword = await hashPassword(data.password);

        const newUser = await this.userRepository.create({
            ...data,
            password:hashedPassword,
            rol: role
        })

        return newUser;
    }
}