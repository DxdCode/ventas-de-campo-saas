import "@infrastructure/container";
import { Router } from "express";
import { container } from "tsyringe";
import { RouteController } from "@interfaces/controllers/route/RouteController";
import { checkRole } from "@interfaces/middlewares/verifyRole";

const routes = Router();
const routeController = container.resolve(RouteController);

// Rutas para la gestión de rutas de venta
routes.post("/", checkRole(["administrador"]), routeController.createRoute);
routes.put("/:id", checkRole(["administrador"]), routeController.updateRoute);
routes.patch("/:id/assign", checkRole(["administrador"]), routeController.assignUsers);
routes.get("/", checkRole(["administrador", "vendedor"]), routeController.getAllRoutes);
routes.get("/:id", checkRole(["administrador", "vendedor"]), routeController.getRouteById);

export default routes;