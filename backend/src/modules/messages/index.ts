import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  messageInit,
  messageModelName,
} from 'src/modules/messages/infras/repo/postgres/dto';
import { PostgresMessageRepository } from 'src/modules/messages/infras/repo/postgres/repo';
import { MessageHttpService } from 'src/modules/messages/infras/transport/message.http-service';
import { MessageUsecase } from 'src/modules/messages/usecase';

export const setupMessageRouter = (sequelize: Sequelize) => {
  messageInit(sequelize);
  const messageRouter = Router();
  const messageRepo = new PostgresMessageRepository(
    sequelize,
    messageModelName
  );
  const messageUsecase = new MessageUsecase(messageRepo);
  const messageHttpService = new MessageHttpService(messageUsecase);
  messageRouter.get(
    '/',
    messageHttpService.getMessageList.bind(messageHttpService)
  );
  messageRouter.get(
    '/:id',
    messageHttpService.getMessageById.bind(messageHttpService)
  );
  messageRouter.post(
    '/',
    messageHttpService.createMessage.bind(messageHttpService)
  );
  messageRouter.put(
    '/:id',
    messageHttpService.updateMessage.bind(messageHttpService)
  );
  messageRouter.delete(
    '/:id',
    messageHttpService.deleteMessage.bind(messageHttpService)
  );
  return messageRouter;
};
