import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { RegisterUserUseCase } from "@application/usecases/auth/RegisterUserUseCase";
import { LoginUserUseCase } from "@application/usecases/auth/LoginUserUseCase";
import { TokenService } from "@infrastructure/services/TokenService";

@injectable()
export class AuthController {
  constructor(
    @inject(RegisterUserUseCase) private readonly registerUseCase: RegisterUserUseCase,
    @inject(LoginUserUseCase) private readonly loginUseCase: LoginUserUseCase,
    @inject(TokenService) private readonly tokenService: TokenService
  ) {}

  // Registro de usuario
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.registerUseCase.execute(req.body);
      return res.status(201).json({
        message: "Usuario registrado exitosamente",
        user,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido en el registro";
      return res.status(400).json({ message });
    }
  };

  // Inicio de sesión
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.loginUseCase.execute(req.body);

      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: data.user,
        accessToken: data.accessToken,   
        refreshToken: data.refreshToken, 
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido en el login";
      console.log(message);
      return res.status(400).json({ message });
    }
  };

  // Refrescar tokens
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ message: "No se encontró el refresh token" });

      const tokens = await this.tokenService.verifyAndRefresh(refreshToken);

      return res.status(200).json({
        message: "Tokens actualizados correctamente",
        accessToken: tokens.accessToken,   // Devolver accessToken actualizado
        refreshToken: tokens.refreshToken, // Devolver refreshToken actualizado
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al refrescar tokens";
      return res.status(403).json({ message });
    }
  };

  // Cerrar sesión
  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await this.tokenService.revokeRefreshToken(refreshToken);
      }

      return res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al cerrar sesión";
      return res.status(400).json({ message });
    }
  };
}
