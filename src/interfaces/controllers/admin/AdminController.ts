import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AdminUserUseCase } from '@application/usecases/admin/AdminUserUseCase';
import { UpdateUserStatusDTO } from '@application/dtos/user/UserDTO';

@injectable()
export class AdminController {
    constructor(
        @inject(AdminUserUseCase) private adminUserUseCase: AdminUserUseCase
    ) { }

    createUserWithRole = async (req: Request, res: Response) => {
        try {
            const user = await this.adminUserUseCase.createUser(req.body);
            return res.status(201).json({
                message: "Usuario creado exitosamente",
                user,
            });
        } catch (error: any) {
            const message = error.message || "Error desconocido";
            console.error(message);
            return res.status(400).json({ message });
        }
    }

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const includeInactive = req.query.includeInactive === "true";
            const users = await this.adminUserUseCase.getAllUsers(includeInactive);
            return res.json({
                message: "Usuarios obtenidos exitosamente",
                users
            });
        } catch (error: any) {
            const message = error.message || "Error desconocido";
            console.error(message);
            return res.status(500).json({ message });
        }
    }

    updateUserStatus = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const data: UpdateUserStatusDTO = req.body;

            const currentUser = await this.adminUserUseCase.getUserById(userId);
            if (!currentUser) return res.status(404).json({ message: "Usuario no encontrado" });

            if (currentUser.isActive === data.isActive) {
                return res.status(200).json({
                    message: `El usuario ya está ${data.isActive ? 'activo' : 'inactivo'}`
                });
            }

            const updatedUser = await this.adminUserUseCase.updateUserStatus(userId, data);
            return res.json({
                message: `Estado del usuario actualizado a ${updatedUser?.isActive ? 'activo' : 'inactivo'}`,
                user: updatedUser
            });
        } catch (error: any) {
            const message = error.message || "Error desconocido";
            console.error(message);
            return res.status(400).json({ message });
        }
    }

    softDeleteUser = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            await this.adminUserUseCase.softDeleteUser(userId); // no retorna nada
            return res.status(200).json({ message: "Usuario eliminado lógicamente" });
        } catch (error: any) {
            const message = error.message || "Error desconocido";
            console.error(message);
            return res.status(400).json({ message });
        }
    }

    hardDeleteUser = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            await this.adminUserUseCase.hardDeleteUser(userId);
            return res.status(200).json({ message: "Usuario eliminado permanentemente" });
        } catch (error: any) {
            const message = error.message || "Error desconocido";
            console.error(message);
            return res.status(400).json({ message });
        }
    }
}
