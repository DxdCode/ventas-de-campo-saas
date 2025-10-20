
import "@infrastructure/container"
import { AdminController } from "@interfaces/controllers/auth/AdminController";
import { checkRole } from "@interfaces/middlewares/verifyRole";
import { Router } from "express"
import { container } from "tsyringe";

const routes = Router();
const adminController = container.resolve(AdminController);

// Ruta para crear usuarios con roles especificos
routes.post("/create-user-with-role", checkRole(["administrador"]), adminController.createUserWithRole);

export default routes