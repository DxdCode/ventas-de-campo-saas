import bcrypt from 'bcrypt'

// Hashea la contraseña con un salt rounds de 10
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

// Verifica si la contraseña coincide con el hash almacenado
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}
