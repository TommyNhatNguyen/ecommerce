import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { actorModelName } from 'src/modules/messages/actor/infras/postgres/dto';
import { PostgresActorRepository } from 'src/modules/messages/actor/infras/postgres/repo';
import { ActorUsecase } from 'src/modules/messages/actor/usecase';
import { PostgresEntityRepository } from 'src/modules/messages/entity/infras/postgres/repo';
import { entityModelName } from 'src/modules/messages/entity/infras/postgres/dto';
import {
  messageInit,
  messageModelName,
} from 'src/modules/messages/infras/repo/postgres/dto';
import { PostgresMessageRepository } from 'src/modules/messages/infras/repo/postgres/repo';
import { MessageHttpService } from 'src/modules/messages/infras/transport/message.http-service';
import { MessageUsecase } from 'src/modules/messages/usecase';
import { EntityUsecase } from 'src/modules/messages/entity/usecase';
import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { CustomerUseCase } from 'src/modules/customer/usecase';

export const setupMessageRouter = (sequelize: Sequelize) => {
  messageInit(sequelize);
  const messageRouter = Router();
  const customerRepo = new PostgresCustomerRepository(sequelize, customerModelName);
  const customerUsecase = new CustomerUseCase(customerRepo);
  const actorRepo = new PostgresActorRepository(sequelize, actorModelName);
  const actorUsecase = new ActorUsecase(actorRepo);
  const entityRepo = new PostgresEntityRepository(sequelize, entityModelName);
  const entityUsecase = new EntityUsecase(entityRepo);
  const messageRepo = new PostgresMessageRepository(
    sequelize,
    messageModelName
  );
  const messageUsecase = new MessageUsecase(messageRepo, actorUsecase, entityUsecase, customerUsecase);
  const messageHttpService = new MessageHttpService(messageUsecase);
  messageRouter.get(
    '/message',
    messageHttpService.getMessageList.bind(messageHttpService)
  );
  messageRouter.get(
    '/message/:id',
    messageHttpService.getMessageById.bind(messageHttpService)
  );
  messageRouter.post(
    '/message',
    messageHttpService.createMessage.bind(messageHttpService)
  );
  messageRouter.put(
    '/message/:id',
    messageHttpService.updateMessage.bind(messageHttpService)
  );
  messageRouter.delete(
    '/message/:id',
    messageHttpService.deleteMessage.bind(messageHttpService)
  );
  return messageRouter;
};
