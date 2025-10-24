
import "@infrastructure/container"
import { AdminController } from "@interfaces/controllers/admin/AdminController";
import { ProductController } from "@interfaces/controllers/product/ProductController";
import { RouteController } from "@interfaces/controllers/route/RouteController";

import { checkRole } from "@interfaces/middlewares/verifyRole";
import { Router } from "express"
import { container } from "tsyringe";

const routes = Router();
const adminController = container.resolve(AdminController);
const routeController = container.resolve(RouteController);
const productController = container.resolve(ProductController);

// Ruta para crear usuarios con roles especificos
routes.post("/create/user", checkRole(["administrador"]), adminController.createUserWithRole);
routes.get("/users", checkRole(["administrador"]), adminController.getAllUsers);
routes.patch("/users/:id/status", checkRole(["administrador"]), adminController.updateUserStatus);
routes.delete("/users/:id/soft", checkRole(["administrador"]), adminController.softDeleteUser);
routes.delete("/users/:id/hard", checkRole(["administrador"]), adminController.hardDeleteUser);

// Rutas para la gestión de rutas de venta
routes.post("/route/", checkRole(["administrador"]), routeController.createRoute);
routes.put("/route/:id", checkRole(["administrador"]), routeController.updateRoute);
routes.patch("/route/:id/assign", checkRole(["administrador"]), routeController.assignUsers);
routes.get("/route/", checkRole(["administrador", "vendedor"]), routeController.getAllRoutes);
routes.get("/route/:id", checkRole(["administrador", "vendedor"]), routeController.getRouteById);


// Rutas para la gestión de productos
routes.post("/products/", checkRole(["administrador"]), productController.createProduct);
routes.put("/products/:id", checkRole(["administrador"]), productController.updateProduct);
routes.delete("/products/:id", checkRole(["administrador"]), productController.deleteProduct);
routes.get("/products/", checkRole(["administrador", "vendedor"]), productController.getAllProducts);
routes.get("/products/:id", checkRole(["administrador", "vendedor"]), productController.getProductById);

export default routes