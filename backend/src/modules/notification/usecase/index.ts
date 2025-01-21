
import { Socket } from "socket.io";
import { NotificationPersistence } from "src/modules/notification/infras/repo/socket/repo";
import { INotificationUseCase } from "src/modules/notification/models/notification.interface";
import Websocket from "src/share/modules/websocket";

export class NotificationUseCase implements INotificationUseCase {
  constructor(private readonly notificationPersistence: NotificationPersistence ) {}

  notifyOrderCreatedToCustomer(data: any) {
    this.notificationPersistence.notifyOrderCreatedToCustomer(data);
  }

  notifyOrderCreated(data: any, isBroadcast: boolean = false) {
    this.notificationPersistence.notifyOrderCreated(data, isBroadcast);
  }

  listenOrderCreated(callback: (data: any) => void) {
    this.notificationPersistence.listenOrderCreated(callback);
  }
} 
