import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { jwtRefresh, jwtSign, jwtVerify } from 'src/middlewares/jwt';
import { userModelName } from 'src/modules/user/infras/repo/dto';
import { userInit } from 'src/modules/user/infras/repo/dto';
import { PostgresUserRepository } from 'src/modules/user/infras/repo/repo';
import { UserHttpService } from 'src/modules/user/infras/transport/user-http.service';
import { UserUseCase } from 'src/modules/user/usecase';

export const setupUserRouter = (sequelize: Sequelize) => {
  userInit(sequelize);
  const router = Router();
  const userRepository = new PostgresUserRepository(sequelize, userModelName);
  const userUseCase = new UserUseCase(userRepository);
  const userHttpService = new UserHttpService(userUseCase);
  router.get(
    '/users',
    jwtVerify,
    userHttpService.getUsers.bind(userHttpService)
  );
  router.get('/users/:id', userHttpService.getUserById.bind(userHttpService));
  router.post(
    '/users/login',
    userHttpService.login.bind(userHttpService),
    jwtSign
  );
  router.post('/users/refresh-token', jwtRefresh);
  router.post('/users', userHttpService.createUser.bind(userHttpService));
  router.put('/users/:id', userHttpService.updateUser.bind(userHttpService));
  router.delete('/users/:id', userHttpService.deleteUser.bind(userHttpService));
  router.get('/users-info', jwtVerify, userHttpService.getUserByUsername.bind(userHttpService));
  return router;
};
