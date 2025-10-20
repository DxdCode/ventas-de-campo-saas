import { AdminUserUseCase } from "@application/usecases/auth/AdminUserUseCase";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";


@injectable()

export class AdminController {
    constructor(
        @inject(AdminUserUseCase) private adminUserUseCase: AdminUserUseCase
    ) { }

    // Maneja para crear usuarios con roles especificos
    createUserWithRole = async (req: Request, res: Response) => {
        try {
            const user = await this.adminUserUseCase.execute(req.body)
            return res.status(201).json({
                message: "Usuario creado exitosamente",
                user,
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            console.log(message);
            return res.status(400).json({ message });
        }
    }
}