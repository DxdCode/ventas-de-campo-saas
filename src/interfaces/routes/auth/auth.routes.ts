import "@infrastructure/container";
import { container } from "tsyringe";
import { Router } from "express";
import { AuthController } from "@interfaces/controllers/auth/AuthController";
import { validate } from "@interfaces/middlewares/validateMiddleware";
import { loginSchema } from "@interfaces/validators/auth/LoginValidator";
import { registerSchema } from "@interfaces/validators/auth/registerValidator";

const routes = Router();
const authController = container.resolve(AuthController);

// Ruta para registrar usuarios con validación del body
routes.post("/register", validate(registerSchema), authController.register);

// Ruta para login de usuarios con validación del body
routes.post("/login", validate(loginSchema), authController.login);

// Ruta para refresh token
routes.post("/refresh-token",authController.refreshToken);

export default routes;
