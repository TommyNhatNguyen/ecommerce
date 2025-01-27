import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { permissionRoleModelName } from 'src/modules/permission/infras/repo/dto';
import {
  roleModelName,
} from 'src/modules/role/infras/repo/dto';
import { roleInit } from 'src/modules/role/infras/repo/dto';
import { PostgresRoleRepository } from 'src/modules/role/infras/repo/repo';
import { RoleHttpService } from 'src/modules/role/infras/transport/role-http.service';
import { RoleUserCase } from 'src/modules/role/usecase';

export const setupRoleRouter = (sequelize: Sequelize) => {
  roleInit(sequelize);
  const router = Router();
  const roleRepository = new PostgresRoleRepository(sequelize, roleModelName);
  const permissionRoleRepository = new PostgresRoleRepository(
    sequelize,
    permissionRoleModelName
  );
  const roleUseCase = new RoleUserCase(roleRepository, permissionRoleRepository);
  const roleHttpService = new RoleHttpService(roleUseCase);
  router.get('/roles', roleHttpService.getRoles.bind(roleHttpService));
  router.get('/roles/:id', roleHttpService.getRoleById.bind(roleHttpService));
  router.get('/roles/:id/permissions', roleHttpService.getRoleWithPermissions.bind(roleHttpService));
  router.post('/roles', roleHttpService.createRole.bind(roleHttpService));
  router.put('/roles/:id', roleHttpService.updateRole.bind(roleHttpService));
  router.put(
    '/roles/:id/update-permissions',
    roleHttpService.updatePermissionToRole.bind(roleHttpService)
  );
  router.delete('/roles/:id', roleHttpService.deleteRole.bind(roleHttpService));
  return router;
};
