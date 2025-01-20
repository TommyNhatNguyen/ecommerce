export interface INotificationUseCase {
  notifyOrderCreated(data: any): void;
  listenOrderCreated(callback: (data: any) => void): void;
}

export interface INotificationPersistence {
  notifyOrderCreated(data: any): void;
  listenOrderCreated(callback: (data: any) => void): void;
}
