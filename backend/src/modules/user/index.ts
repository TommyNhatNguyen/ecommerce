import { NextFunction, Request, Response, Router } from "express";
import { Sequelize } from "sequelize";
import { CloudinaryImageRepository } from "src/infras/repository/image/repo";
import { JWT_TYPES, jwtRefresh, jwtSign, jwtVerify } from "src/middlewares/jwt";
import { userModelName } from "src/modules/user/infras/repo/dto";
import { userInit } from "src/modules/user/infras/repo/dto";
import { PostgresUserRepository } from "src/modules/user/infras/repo/repo";
import { UserHttpService } from "src/modules/user/infras/transport/user-http.service";
import { UserUseCase } from "src/modules/user/usecase";
import cloudinary from "src/share/cloudinary";

export const setupUserRouter = (sequelize: Sequelize) => {
  userInit(sequelize);
  const router = Router();
  const userRepository = new PostgresUserRepository(sequelize, userModelName);
  const cloudinaryImageRepository = new CloudinaryImageRepository(cloudinary);
  const userUseCase = new UserUseCase(
    userRepository,
    cloudinaryImageRepository
  );
  const userHttpService = new UserHttpService(userUseCase);
  router.get(
    "/users",
    jwtVerify,
    userHttpService.getUsers.bind(userHttpService)
  );
  router.get("/users/:id", userHttpService.getUserById.bind(userHttpService));
  router.post(
    "/users/login",
    userHttpService.login.bind(userHttpService),
    (req: Request, res: Response, next: NextFunction) => {
      res.locals.type = JWT_TYPES.ADMIN;
      next();
    },
    jwtSign
  );
  router.post(
    "/users/refresh-token",
    (req: Request, res: Response, next: NextFunction) => {
      res.locals.type = JWT_TYPES.ADMIN;
      next();
    },
    jwtRefresh
  );
  router.post("/users", userHttpService.createUser.bind(userHttpService));
  router.put("/users/:id", userHttpService.updateUser.bind(userHttpService));
  router.delete("/users/:id", userHttpService.deleteUser.bind(userHttpService));
  router.get(
    "/users-info",
    (req: Request, res: Response, next: NextFunction) => {
      res.locals.type = JWT_TYPES.ADMIN;
      next();
    },
    jwtVerify,
    userHttpService.getUserByUsername.bind(userHttpService)
  );
  return router;
};
