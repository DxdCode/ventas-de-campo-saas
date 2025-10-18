import { RegisterUserUseCase } from "@application/usecases/CreateUserUseCase";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";
import { Request, Response } from "express";

const userRepository = new UserRepository
const registerUserUseCase = new RegisterUserUseCase(userRepository);

export class AuthController {
    static async register(req: Request, res:Response){
        try {
            const user = await registerUserUseCase.execute(req.body);
            return res.status(201).json({
                message: "Usuario registrado correctamente",
                user:{id:user.id, name: user.name, email: user.email}
            })
        } catch (err: any) {
            return res.status(400).json({msg: err.message})
        }
    }
}