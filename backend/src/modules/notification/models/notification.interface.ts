export interface INotificationUseCase {
  notifyOrderCreated(data: any, isBroadcast: boolean): void;
  notifyOrderCreatedToCustomer(data: any): void;
  listenOrderCreated(callback: (data: any) => void): void;
}

export interface INotificationPersistence {
  notifyOrderCreated(data: any, isBroadcast: boolean): void;
  notifyOrderCreatedToCustomer(data: any): void;
  listenOrderCreated(callback: (data: any) => void): void;
}
