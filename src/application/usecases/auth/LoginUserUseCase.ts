import { LoginDTO } from "@application/dtos/auth/LoginDTO";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";
import { TokenService } from "@infrastructure/services/TokenService";
import { verifyPassword } from "@shared/utils/hash";

export class LoginUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private tokenService: TokenService
    ) { }

    async execute(data: LoginDTO) {

        // Buscar usuario por email
        const user = await this.userRepository.findByEmail(data.email)
        if (!user) throw new Error("Usuario o contraseña incorrectos");

        // Verificamos la contraseña
        const isValidPassword = await verifyPassword(data.password, user.password)
        if (!isValidPassword) throw new Error("Usuario o contraseña incorrectos");

        const tokens = await this.tokenService.generateTokens(user)
        return {
            user:{
                name: user.name,
                role:user.rol.nombre,
            },
            ...tokens
        }
    }
}