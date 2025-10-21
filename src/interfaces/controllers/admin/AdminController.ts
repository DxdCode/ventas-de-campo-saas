import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { AdminUserUseCase } from '@application/usecases/admin/AdminUserUseCase';
import { UpdateUserStatusDTO } from '@application/dtos/user/UserDTO';

@injectable()
export class AdminController {
    constructor(
        @inject(AdminUserUseCase) private adminUserUseCase: AdminUserUseCase
    ) { }

    // Crear usuario con rol
    createUserWithRole = async (req: Request, res: Response) => {
        try {
            const user = await this.adminUserUseCase.createUser(req.body)
            return res.status(201).json({
                message: "Usuario creado exitosamente",
                user,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            console.log(message);
            return res.status(400).json({ message });
        }
    }

    // Listar todos los usuarios
    getAllUsers = async (req: Request, res: Response) => {
        try {
            const includeInactive = req.query.includeInactive === "true";
            const users = await this.adminUserUseCase.getAllUsers(includeInactive);
            return res.json({
                message: "Usuarios obtenidos exitosamente",
                users
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            console.log(message);
            return res.status(500).json({ message });
        }
    }

    // Actualizar estado de usuario
    updateUserStatus = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const data: UpdateUserStatusDTO = req.body;

            // Primero obtenemos el usuario actual
            const currentUser = await this.adminUserUseCase.getUserById(userId);
            if (!currentUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            // Verificamos si el estado ya es el mismo
            if (currentUser.isActive === data.isActive) {
                return res.status(200).json({
                    message: `El usuario ya está ${data.isActive ? 'activo' : 'inactivo'}`
                });
            }

            // Si el estado es diferente, lo actualizamos
            const updatedUser = await this.adminUserUseCase.updateUserStatus(userId, data);

            if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });
            return res.json({
                message: `Estado del usuario actualizado exitosamente a ${updatedUser.isActive ? 'activo' : 'inactivo'}`,
                user: updatedUser
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            console.log(message);
            return res.status(400).json({ message });
        }
    }

    // Borrado lógico
    softDeleteUser = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            await this.adminUserUseCase.softDeleteUser(userId);
            return res.status(200).json({ message: "Usuario eliminado lógicamente" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            console.log(message);
            return res.status(400).json({ message });
        }
    }

    // Borrado físico
    hardDeleteUser = async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            await this.adminUserUseCase.hardDeleteUser(userId);
            return res.status(200).json({ message: "Usuario eliminado permanentemente" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            console.log(message);
            return res.status(400).json({ message });
        }
    }
}
