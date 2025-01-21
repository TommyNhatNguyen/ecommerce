import { Sequelize } from 'sequelize';
import { Socket } from 'socket.io';
import { actorModelName } from 'src/modules/messages/actor/infras/postgres/dto';
import { PostgresActorRepository } from 'src/modules/messages/actor/infras/postgres/repo';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { CustomerUseCase } from 'src/modules/customer/usecase';
import { messageModelName } from 'src/modules/messages/infras/repo/postgres/dto';
import { PostgresMessageRepository } from 'src/modules/messages/infras/repo/postgres/repo';
import { MessageUsecase } from 'src/modules/messages/usecase';
import { NotificationSocket } from 'src/modules/notification/infras/repo/socket/dto';
import { NotificationPersistence } from 'src/modules/notification/infras/repo/socket/repo';
import { SOCKET_EVENTS_ENDPOINT } from 'src/modules/notification/infras/transport/socket-endpoint';
import { NotificationUseCase } from 'src/modules/notification/usecase';
import Websocket from 'src/share/modules/websocket';
import { ActorUsecase } from 'src/modules/messages/actor/usecase';
import { PostgresEntityRepository } from 'src/modules/messages/entity/infras/postgres/repo';
import { entityModelName } from 'src/modules/messages/entity/infras/postgres/dto';
import { EntityUsecase } from 'src/modules/messages/entity/usecase';
import { IMessageCreateDTO } from 'src/modules/messages/models/message.dto';

export const setupNotification = (io: Websocket, sequelize: Sequelize) => {
  // --- ORDER NOTIFICATION ---
  const orderNotificationSocket = new NotificationSocket('order', io).init([
    (socket, next) => {
      next();
    },
  ]);
  const customerRepo = new PostgresCustomerRepository(
    sequelize,
    customerModelName
  );
  const customerUsecase = new CustomerUseCase(customerRepo);
  const actorRepo = new PostgresActorRepository(sequelize, actorModelName);
  const actorUsecase = new ActorUsecase(actorRepo);
  const entityRepo = new PostgresEntityRepository(sequelize, entityModelName);
  const entityUsecase = new EntityUsecase(entityRepo);
  const messageRepo = new PostgresMessageRepository(
    sequelize,
    messageModelName
  );
  const messageUsecase = new MessageUsecase(
    messageRepo,
    actorUsecase,
    entityUsecase,
    customerUsecase
  );
  const onOrderConnection = (socket: Socket) => {
    const orderNotificationPersistence = new NotificationPersistence(socket);
    const orderNotificationUseCase = new NotificationUseCase(
      orderNotificationPersistence
    );
    orderNotificationUseCase.listenOrderCreated(async (data) => {
      console.log('orderNotification', JSON.parse(data));
      const payload: IMessageCreateDTO = {
        actor_info_id: JSON.parse(data).actor_info_id,
        actor_type: JSON.parse(data).actor_type,
        entity_info: JSON.parse(data).entity_info,
        message: JSON.parse(data).message,
        entity_id: '',
        actor_id: '',
      };
      const message = await messageUsecase.createMessage(payload);
      orderNotificationUseCase.notifyOrderCreated(message.message, true);
      orderNotificationUseCase.notifyOrderCreatedToCustomer(
        'Thank you for your order! You will receive an email when your order is ready!'
      );
    });
    console.log(
      '🚀 ~ onOrderConnection ~ socket Client Count:',
      io.engine.clientsCount
    );
  };
  orderNotificationSocket.on(
    SOCKET_EVENTS_ENDPOINT.CONNECTION,
    onOrderConnection
  );
  // --- END ORDER NOTIFICATION ---
};
