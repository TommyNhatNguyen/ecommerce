import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { resourcePermissionInit, resourcesModelName } from 'src/modules/resources/infras/repo/resources.dto';
import { resourcesInit } from 'src/modules/resources/infras/repo/resources.dto';
import { ResourcesRepository } from 'src/modules/resources/infras/repo/resources.repo';
import { ResourcesHttpService } from 'src/modules/resources/infras/transport/resources.http-service';
import { ResourcesUseCase } from 'src/modules/resources/usecase';

export const setupResourcesRouter = (sequelize: Sequelize) => {
  resourcesInit(sequelize);
  resourcePermissionInit(sequelize);
  const router = Router();
  const resourcesRepository = new ResourcesRepository(
    sequelize,
    resourcesModelName
  );
  const resourcesUseCase = new ResourcesUseCase(resourcesRepository);
  const resourcesHttpService = new ResourcesHttpService(resourcesUseCase);
  router.get(
    '/resources',
    resourcesHttpService.getResources.bind(resourcesHttpService)
  );
  router.get(
    '/resources/:id',
    resourcesHttpService.getResourcesById.bind(resourcesHttpService)
  );
  router.post(
    '/resources',
    resourcesHttpService.createResources.bind(resourcesHttpService)
  );
  router.put(
    '/resources/:id',
    resourcesHttpService.updateResources.bind(resourcesHttpService)
  );
  router.delete(
    '/resources/:id',
    resourcesHttpService.deleteResources.bind(resourcesHttpService)
  );
  return router;
};
