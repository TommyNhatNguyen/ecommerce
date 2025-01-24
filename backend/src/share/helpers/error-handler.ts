import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Hihiiiiihihihihi');
  console.error(err.stack);
  if (err) {
    res.status(404).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
