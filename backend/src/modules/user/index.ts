import { NextFunction, Request, Response, Router } from 'express';
import { Sequelize } from 'sequelize';
import { CloudinaryImageRepository } from 'src/modules/image/infras/repo/repo';
import {
  JWT_TYPES,
  JWT_TYPES_ENUM,
  jwtRefresh,
  jwtSign,
  jwtVerify,
} from 'src/middlewares/jwt';
import { jwtType } from 'src/middlewares/jwt-type';
import { userModelName } from 'src/modules/user/infras/repo/dto';
import { userInit } from 'src/modules/user/infras/repo/dto';
import { PostgresUserRepository } from 'src/modules/user/infras/repo/repo';
import { UserHttpService } from 'src/modules/user/infras/transport/user-http.service';
import { UserUseCase } from 'src/modules/user/usecase';
import cloudinary from 'src/share/cloudinary';

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
    '/users',
    jwtType(JWT_TYPES_ENUM.ADMIN),
    jwtVerify,
    userHttpService.getUsers.bind(userHttpService)
  );
  router.get('/users/:id', userHttpService.getUserById.bind(userHttpService));
  router.post(
    '/users/login',
    userHttpService.login.bind(userHttpService),
    jwtType(JWT_TYPES_ENUM.ADMIN),
    jwtSign
  );
  router.post(
    '/users/refresh-token',
    jwtType(JWT_TYPES_ENUM.ADMIN),
    jwtRefresh
  );
  router.post('/users', userHttpService.createUser.bind(userHttpService));
  router.put('/users/:id', userHttpService.updateUser.bind(userHttpService));
  router.delete('/users/:id', userHttpService.deleteUser.bind(userHttpService));
  router.get(
    '/users-info',
    jwtType(JWT_TYPES_ENUM.ADMIN),
    jwtVerify,
    userHttpService.getUserByUsername.bind(userHttpService)
  );
  return router;
};
