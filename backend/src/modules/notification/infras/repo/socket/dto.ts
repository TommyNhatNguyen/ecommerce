import { Socket } from 'socket.io';
import Websocket from 'src/share/modules/websocket';

export class NotificationSocket {
  declare namespace: string;
  declare io: Websocket;
  declare middlewares: ((socket: Socket, next: (err?: any) => void) => void)[];
  constructor(namespace: string, io: Websocket) {
    this.namespace = namespace;
    this.io = io;
    this.middlewares = [];
  }

  init(middlewares?: ((socket: Socket, next: (err?: any) => void) => void)[]) {
    if (middlewares && middlewares.length > 0) {
      this.middlewares = middlewares;
      this.middlewares.map((middleware) => {
        this.io.of(this.namespace).use(middleware);
      });
    }
    return this.io.of(this.namespace);
  }
}
