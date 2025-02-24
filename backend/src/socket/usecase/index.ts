import { SocketIoAdapter } from 'src/socket/infras/transport';
import { ISocketUseCase } from 'src/socket/models/socket.interface';

export class SocketUseCase implements ISocketUseCase {
  constructor(private readonly socketIo: SocketIoAdapter) {}
  emit(event: string, data: any): void {
    console.log(`📢 WebSocket Sent: ${event}`, data);
    this.socketIo.emit(event, data);
  }
  on(event: string, callback: (data: any) => void): void {
    console.log(`📢 WebSocket Received: ${event}`);
    this.socketIo.on(event, callback);
  }
  off(event: string, callback: (data: any) => void): void {
    console.log(`📢 WebSocket Off: ${event}`);
    this.socketIo.off(event, callback);
  }
  close(): void {
    console.log(`📢 WebSocket Closed`);
    this.socketIo.close();
  }
}
