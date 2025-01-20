import { Router } from "express";
import { Sequelize } from "sequelize";
import { PostgresActorRepository } from "src/modules/messages/actor/infras/postgres/repo";
import { actorInit, actorModelName } from "src/modules/messages/actor/infras/postgres/dto";
import { ActorUsecase } from "src/modules/messages/actor/usecase";
import { ActorHttpService } from "src/modules/messages/actor/infras/transport/actor.http-service";

export const setupActorRouter = (sequelize: Sequelize) => {
  actorInit(sequelize);
  const router = Router();
  const actorRepository = new PostgresActorRepository(
    sequelize,
    actorModelName
  );
  const actorUseCase = new ActorUsecase(actorRepository);
  const actorHttpService = new ActorHttpService(actorUseCase);
  router.get(
    '/actor/:id',
    actorHttpService.getActorById.bind(actorHttpService)
  );
  router.get('/actor', actorHttpService.getActorList.bind(actorHttpService));
  router.post('/actor', actorHttpService.createActor.bind(actorHttpService));
  router.put('/actor/:id', actorHttpService.updateActor.bind(actorHttpService));
  router.delete(
    '/actor/:id',
    actorHttpService.deleteActor.bind(actorHttpService)
  );
  return router;
};