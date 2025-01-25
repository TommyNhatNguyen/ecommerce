import { Router } from "express";
import { Sequelize } from "sequelize";
import { userInit, userModelName } from "src/infras/repository/user/dto";
import { PostgresUserRepository } from "src/infras/repository/user/repo";
import { UserHttpService } from "src/infras/transport/user/user-http.service";
import { UserUseCase } from "src/usecase/user";

export const setupUserRouter = (sequelize: Sequelize) => {
  userInit(sequelize);
  const router = Router();
  const userRepository = new PostgresUserRepository(sequelize, userModelName);
  const userUseCase = new UserUseCase(userRepository);
  const userHttpService = new UserHttpService(userUseCase);
  router.get('/users', userHttpService.getUsers.bind(userHttpService));
  router.get('/users/:id', userHttpService.getUserById.bind(userHttpService));
  router.post('/users/login', userHttpService.login.bind(userHttpService))
  router.post('/users', userHttpService.createUser.bind(userHttpService));
  router.put('/users/:id', userHttpService.updateUser.bind(userHttpService));
  router.delete('/users/:id', userHttpService.deleteUser.bind(userHttpService));
  return router;
}