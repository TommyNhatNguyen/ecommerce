import { Namespace } from 'socket.io';
import { Server, DefaultEventsMap } from 'socket.io';
import { ISocketRepository } from 'src/socket/models/socket.interface';

export class SocketIoAdapter implements ISocketRepository {
  constructor(
    private readonly io: Namespace<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >
  ) {}
  emit(event: string, data: any): void {
    this.io.emit(event, data);
  }
  on(event: string, callback: (data: any) => void): void {
    this.io.on(event, callback);
  }
  off(event: string, callback: (data: any) => void): void {
    this.io.off(event, callback);
  }
  close(): void {
    this.io.sockets.forEach((socket) => {
      socket.disconnect();
    });
  }
}
