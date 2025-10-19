import { injectable, inject } from "tsyringe";
import { TokenService } from "@infrastructure/services/TokenService";
import { LoginDTO } from "@application/dtos/auth/LoginDTO";
import { verifyPassword } from "@shared/utils/hash";
import { IUserRepository } from "@application/ports/role/IUserRepository";

// Caso de uso para autenticar usuarios y generar tokens JWT
@injectable()
export class LoginUserUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject(TokenService) private tokenService: TokenService
  ) {}

  async execute(data: LoginDTO) {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new Error("Usuario no encontrado");

    // Verificar contraseña
    const isValid = await verifyPassword(data.password, user.password);
    if (!isValid) throw new Error("Usuario o contraseña incorrectos");

    // Generar tokens de acceso y refresco
    const tokens = await this.tokenService.generateTokens(user);

    // Retornar información básica del usuario junto con los tokens
    return {
      user: {
        name: user.name,
        role: user.rol.nombre,
      },
      ...tokens,
    };
  }
}
