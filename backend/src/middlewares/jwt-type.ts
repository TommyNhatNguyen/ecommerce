import { JWT_TYPES_ENUM } from 'src/middlewares/jwt';
import { NextFunction, Request, Response } from 'express';

export const jwtType = (type: JWT_TYPES_ENUM) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.type = type;
    next();
  };
};
