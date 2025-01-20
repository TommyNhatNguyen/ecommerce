import { Socket } from 'socket.io';
import { NotificationSocket } from 'src/modules/notification/infras/repo/socket/dto';
import { NotificationPersistence } from 'src/modules/notification/infras/repo/socket/repo';
import { SOCKET_EVENTS_ENDPOINT } from 'src/modules/notification/infras/transport/socket-endpoint';
import { NotificationUseCase } from 'src/modules/notification/usecase';
import Websocket from 'src/share/modules/websocket';

export const setupNotification = (io: Websocket) => {
  // --- ORDER NOTIFICATION ---
  const orderNotificationSocket = new NotificationSocket('order', io).init([
    (socket, next) => {
      next();
    },
  ]);
  const onOrderConnection = (socket: Socket) => {
    const orderNotificationPersistence = new NotificationPersistence(socket);
    const orderNotificationUseCase = new NotificationUseCase(
      orderNotificationPersistence
    );
    orderNotificationUseCase.listenOrderCreated((data) => {
      console.log('orderNotification', data);
      orderNotificationUseCase.notifyOrderCreated(data);
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
