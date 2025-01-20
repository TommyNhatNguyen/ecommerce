import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { PostgresEntityRepository } from 'src/modules/messages/entity/infras/postgres/repo';
import {
  entityInit,
  entityModelName,
} from 'src/modules/messages/entity/infras/postgres/dto';
import { EntityUsecase } from 'src/modules/messages/entity/usecase';
import { EntityHttpService } from 'src/modules/messages/entity/infras/transport/entity.http-service';

export const setupEntityRouter = (sequelize: Sequelize) => {
  entityInit(sequelize);
  const router = Router();
  const entityRepository = new PostgresEntityRepository(
    sequelize,
    entityModelName
  );
  const entityUseCase = new EntityUsecase(entityRepository);
  const entityHttpService = new EntityHttpService(entityUseCase);
  router.get(
    '/entity/:id',
    entityHttpService.getEntityById.bind(entityHttpService)
  );
  router.get(
    '/entity',
    entityHttpService.getEntityList.bind(entityHttpService)
  );
  router.post(
    '/entity',
    entityHttpService.createEntity.bind(entityHttpService)
  );
  router.put(
    '/entity/:id',
    entityHttpService.updateEntity.bind(entityHttpService)
  );
  router.delete(
    '/entity/:id',
    entityHttpService.deleteEntity.bind(entityHttpService)
  );
  return router;
};
