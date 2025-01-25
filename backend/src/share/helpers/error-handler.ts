import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    res.status(404).json({ message: err.message });
    return;
  } else {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

