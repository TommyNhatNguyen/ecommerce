import { Socket } from 'socket.io';
import { SOCKET_EVENTS_ENDPOINT } from 'src/modules/notification/infras/transport/socket-endpoint';
import { INotificationPersistence } from 'src/modules/notification/models/notification.interface';

export class NotificationPersistence implements INotificationPersistence {
  constructor(private readonly socket: Socket) {}

  notifyOrderCreated(data: any) {
    this.socket.emit(SOCKET_EVENTS_ENDPOINT.ORDER_CREATED, data);
  }

  listenOrderCreated(callback: (data: any) => void) {
    this.socket.on(SOCKET_EVENTS_ENDPOINT.ORDER_CREATED, callback);
  }
}
