import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { RegisterUserUseCase } from "@application/usecases/auth/RegisterUserUseCase";
import { LoginUserUseCase } from "@application/usecases/auth/LoginUserUseCase";
import { TokenService } from "@infrastructure/services/TokenService";

@injectable()
export class AuthController {
    constructor(
        @inject(RegisterUserUseCase) private registerUseCase: RegisterUserUseCase,
        @inject(LoginUserUseCase) private loginUseCase: LoginUserUseCase,
        @inject(TokenService) private tokenService:TokenService
    ) { }

    // Maneja el registro de usuarios
    register = async (req: Request, res: Response) => {
        try {
            const user = await this.registerUseCase.execute(req.body);
            return res.status(201).json({
                message: "Usuario registrado exitosamente",
                user,
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            return res.status(400).json({ message });
        }
    };

    // Maneja el login de usuarios
    login = async (req: Request, res: Response) => {
        try {
            const data = await this.loginUseCase.execute(req.body);
            return res.status(200).json(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            return res.status(400).json({ message });
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "El refresh token es requerido" });
        }

        try {
            const tokens = await this.tokenService.verifyAndRefresh(refreshToken)
            return res.status(200).json(tokens);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            return res.status(400).json({ message });
        }
    };
}
