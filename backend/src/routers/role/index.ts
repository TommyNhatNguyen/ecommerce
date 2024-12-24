import { Router } from "express";
import { Sequelize } from "sequelize";
import { roleInit, roleModelName } from "src/infras/repository/role/dto";
import { PostgresRoleRepository } from "src/infras/repository/role/repo";
import { RoleHttpService } from "src/infras/transport/role/role-http.service";
import { RoleUserCase } from "src/usecase/role";

export const setupRoleRouter = (sequelize: Sequelize) => {
  roleInit(sequelize);
  const router = Router();
  const roleRepository = new PostgresRoleRepository(sequelize, roleModelName);
  const roleUseCase = new RoleUserCase(roleRepository);
  const roleHttpService = new RoleHttpService(roleUseCase);
  router.get('/roles', roleHttpService.getRoles.bind(roleHttpService));
  router.get('/roles/:id', roleHttpService.getRoleById.bind(roleHttpService));
  router.post('/roles', roleHttpService.createRole.bind(roleHttpService));
  router.put('/roles/:id', roleHttpService.updateRole.bind(roleHttpService));
  router.delete('/roles/:id', roleHttpService.deleteRole.bind(roleHttpService));
  return router;
};
