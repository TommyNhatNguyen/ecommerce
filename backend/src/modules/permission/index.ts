import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  permissionInit,
  permissionModelName,
  permissionRoleInit,
} from 'src/modules/permission/infras/repo/dto';
import { PermissionRepository } from 'src/modules/permission/infras/repo/repo';
import { PermissionHttpService } from 'src/modules/permission/infras/transport/permission-http.service';
import { PermissionUseCase } from 'src/modules/permission/usecase';

export const setupPermissionRouter = (sequelize: Sequelize) => {
  permissionInit(sequelize);
  permissionRoleInit(sequelize);
  const router = Router();
  const repository = new PermissionRepository(sequelize, permissionModelName);
  const useCase = new PermissionUseCase(repository);
  const httpService = new PermissionHttpService(useCase);
  router.get('/permissions', httpService.getPermissions.bind(httpService));
  router.get('/permissions/:id', httpService.getPermission.bind(httpService));
  router.post('/permissions', httpService.createPermission.bind(httpService));
  router.put(
    '/permissions/:id',
    httpService.updatePermission.bind(httpService)
  );
  router.delete(
    '/permissions/:id',
    httpService.deletePermission.bind(httpService)
  );
  return router;
};
