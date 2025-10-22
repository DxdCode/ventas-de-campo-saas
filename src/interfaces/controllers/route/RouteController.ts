import { Request, Response } from "express";
import { container } from "tsyringe";
import { RouteUseCase } from "../../../application/usecases/route/RouteUseCase";
import { createRouteSchema, updateRouteSchema, assignUsersSchema } from "../../validators/route/RouteValidator";

export class RouteController {
    private routeUseCase: RouteUseCase;

    constructor() {
        this.routeUseCase = container.resolve(RouteUseCase);
    }

    createRoute = async (req: Request, res: Response) => {
        try {
            const validatedData = createRouteSchema.parse(req.body);
            const route = await this.routeUseCase.createRoute(validatedData);
            return res.status(201).json(route);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    updateRoute = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const validatedData = updateRouteSchema.parse(req.body);
            const route = await this.routeUseCase.updateRoute(id, validatedData);
            return res.json(route);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    assignUsers = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const validatedData = assignUsersSchema.parse(req.body);
            const route = await this.routeUseCase.assignUsersToRoute(id, validatedData);
            return res.json(route);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    getAllRoutes = async (_req: Request, res: Response) => {
        try {
            const routes = await this.routeUseCase.getAllRoutes();
            return res.json(routes);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

    getRouteById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const route = await this.routeUseCase.getRouteById(id);
            return res.json(route);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };
}