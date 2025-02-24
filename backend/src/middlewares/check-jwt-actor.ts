import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Add the type definition for the decoded JWT token
interface DecodedToken {
  data: string;
  iat: number;
  exp: number;
}

// Declare a module augmentation for express Request
declare module 'express' {
  interface Request {
    actor?: string;
  }
}

export const checkJwtActor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] || '';
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_JWT_PRIVATE_KEY as string
    ) as DecodedToken;
    req.actor = decoded.data;
  } catch (error) {
    req.actor = 'customer';
  }
  next();
};
