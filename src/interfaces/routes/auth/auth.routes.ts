import { RegisterUserUseCase } from "@application/usecases/auth/CreateUserUseCase";
import { LoginUserUseCase } from "@application/usecases/auth/LoginUserUseCase";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";
import { TokenService } from "@infrastructure/services/TokenService";
import { AuthController } from "@interfaces/controllers/auth/AuthController";
import { validate } from "@interfaces/middlewares/validateMiddleware";
import { loginSchema } from "@interfaces/validators/auth/LoginValidator";
import { registerSchema } from "@interfaces/validators/auth/registerValidator";
import { Router } from "express";

const routes = Router();

// Instancias
const userRepository = new UserRepository();
const tokenService = new TokenService(userRepository); 
const registerUseCase = new RegisterUserUseCase(userRepository);
const loginUseCase = new LoginUserUseCase(userRepository, tokenService);
const authController = new AuthController(registerUseCase, loginUseCase);

// Rutas
routes.post("/register", validate(registerSchema), (req, res) => authController.register(req, res));
routes.post("/login", validate(loginSchema), (req, res) => authController.login(req, res));

export default routes;