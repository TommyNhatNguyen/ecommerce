import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Hihiiiiihihihihi");
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
};
