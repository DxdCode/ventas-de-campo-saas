
import { Response } from "express";


export const setRefreshTokenCookie = (res: Response, name: string, value: string, maxAge: number = 7 * 24 * 60 * 60 * 1000) => {
    res.cookie(name, value, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', 
        maxAge: maxAge,  
    });
};

export const clearCookie = (res: Response, name: string) => {
    res.clearCookie(name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
};