
import "@infrastructure/container"
import { AdminController } from "@interfaces/controllers/admin/AdminController";
import { checkRole } from "@interfaces/middlewares/verifyRole";
import { Router } from "express"
import { container } from "tsyringe";

const routes = Router();
const adminController = container.resolve(AdminController);

// Ruta para crear usuarios con roles especificos
routes.post("/create/user", checkRole(["administrador"]), adminController.createUserWithRole);
routes.get("/users", checkRole(["administrador"]), adminController.getAllUsers);
routes.patch("/users/:id/status", checkRole(["administrador"]), adminController.updateUserStatus);
routes.delete("/users/:id/soft", checkRole(["administrador"]), adminController.softDeleteUser);
routes.delete("/users/:id/hard", checkRole(["administrador"]), adminController.hardDeleteUser);

export default routes