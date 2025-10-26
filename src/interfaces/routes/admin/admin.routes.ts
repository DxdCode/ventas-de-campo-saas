
import "@infrastructure/container"
import { AdminController } from "@interfaces/controllers/admin/AdminController";
import { ProductController } from "@interfaces/controllers/product/ProductController";
import { RouteController } from "@interfaces/controllers/route/RouteController";
import { verifyToken } from "@interfaces/middlewares/verifyToken";
import { checkRole } from "@interfaces/middlewares/verifyRole";
import { Router } from "express"
import { container } from "tsyringe";

const routes = Router();
const adminController = container.resolve(AdminController);
const routeController = container.resolve(RouteController);
const productController = container.resolve(ProductController);

// Ruta para crear usuarios con roles especificos
routes.post("/create/user", verifyToken, checkRole(["administrador"]), adminController.createUserWithRole);
routes.get("/users", verifyToken, checkRole(["administrador"]), adminController.getAllUsers);
routes.patch("/users/:id/status", verifyToken, checkRole(["administrador"]), adminController.updateUserStatus);
routes.delete("/users/:id/soft", verifyToken, checkRole(["administrador"]), adminController.softDeleteUser);
routes.delete("/users/:id/hard", verifyToken, checkRole(["administrador"]), adminController.hardDeleteUser);

// Rutas para la gestión de rutas de venta
routes.post("/route/", verifyToken, checkRole(["administrador"]), routeController.createRoute);
routes.put("/route/:id", verifyToken, checkRole(["administrador"]), routeController.updateRoute);
routes.patch("/route/:id/assign", verifyToken, checkRole(["administrador"]), routeController.assignUsers);
routes.get("/route/", verifyToken, checkRole(["administrador", "vendedor"]), routeController.getAllRoutes);
routes.get("/route/:id", verifyToken, checkRole(["administrador", "vendedor"]), routeController.getRouteById);

// Rutas para la gestión de productos
routes.post("/products/", verifyToken, checkRole(["administrador"]), productController.createProduct);
routes.put("/products/:id", verifyToken, checkRole(["administrador"]), productController.updateProduct);
routes.delete("/products/:id", verifyToken, checkRole(["administrador"]), productController.deleteProduct);
routes.get("/products/", verifyToken, checkRole(["administrador", "vendedor"]), productController.getAllProducts);
routes.get("/products/:id", verifyToken, checkRole(["administrador", "vendedor"]), productController.getProductById);

export default routes