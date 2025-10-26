import { injectable, inject } from "tsyringe";
import { TokenService } from "@infrastructure/services/TokenService";
import { LoginDTO } from "@application/dtos/auth/LoginDTO";
import { verifyPassword } from "@shared/utils/hash";
import { AuthRepository } from "@infrastructure/repositories/auth/AuthRepository";

// Caso de uso para autenticar usuarios y generar tokens JWT
@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(AuthRepository) private authRepository: AuthRepository,
    @inject(TokenService) private tokenService: TokenService
  ) {}

  async execute(data: LoginDTO) {
    // Buscar autenticación por email
    const auth = await this.authRepository.findByEmail(data.email);
    if (!auth) throw new Error("Usuario no encontrado");

    // Verificar contraseña
    const isValid = await verifyPassword(data.password, auth.password);
    if (!isValid) throw new Error("Usuario o contraseña incorrectos");

    // Actualizar último login
    await this.authRepository.updateLastLogin(auth.id);

    // Generar tokens de acceso y refresco
    const tokens = await this.tokenService.generateTokens(auth.user);

    // Retornar información básica del usuario junto con los tokens
    return {
      user: {
        name: auth.user.name,
        role: auth.user.rol.nombre,
      },
      ...tokens,
    };
  }
}
