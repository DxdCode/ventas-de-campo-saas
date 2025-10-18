import { AuthController } from "@interfaces/controllers/auth/AuthController";
import { validate } from "@interfaces/middlewares/validateMiddleware";
import { registerSchema } from "@interfaces/validators/auth/registerValidator";
import { Router } from "express";

const routes = Router();
routes.post("/register",validate(registerSchema),AuthController.register)

export default routes;