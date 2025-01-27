import { NextFunction, Request, Response } from "express";

export const validateAuthorizationRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}