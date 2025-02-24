import { SOCKET_NAMESPACE } from 'src/socket/models/socket-endpoint';

import Websocket from 'src/socket/infras/repo';
import { SocketUseCase } from 'src/socket/usecase';
import { SocketIoAdapter } from 'src/socket/infras/transport';
export const setupSocket = (io: Websocket): SocketUseCase => {
  // Order namespace
  const orderIo = io.of(SOCKET_NAMESPACE.ORDER.namespace);
  const socketIoAdapter = new SocketIoAdapter(orderIo);
  const socketUseCase = new SocketUseCase(socketIoAdapter);
  orderIo.on('connection', (socket) => {
    console.log('Admin connected:', socket.id, io.engine.clientsCount);
    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id, io.engine.clientsCount);
    });
  });
  return socketUseCase;
};
