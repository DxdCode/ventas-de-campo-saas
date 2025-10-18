import { Request, Response } from "express";
import { RegisterUserUseCase } from "@application/usecases/auth/CreateUserUseCase";
import { LoginUserUseCase } from "@application/usecases/auth/LoginUserUseCase";

export class AuthController {
    constructor(
        private registerUseCase: RegisterUserUseCase,
        private loginUseCase: LoginUserUseCase
    ) { }

    register = async(req: Request, res: Response) => {
        try {
            const user = await this.registerUseCase.execute(req.body);
            return res.status(201).json({
                message: "Usuario registrado correctamente",
                user: { id: user.id, name: user.name, email: user.email },
            });
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    }

    login = async(req: Request, res: Response) => {
        try {
            const result = await this.loginUseCase.execute(req.body);
            const {user, ...tokens} = result
            return res.status(200).json({
                message: "Usuario autenticado correctamente",
                user,
                ...tokens,
            });
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    }
}
