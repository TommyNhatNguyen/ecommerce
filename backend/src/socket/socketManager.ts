import { SOCKET_NAMESPACE } from 'src/socket/models/socket-endpoint';

import Websocket from 'src/socket/infras/repo';
import { SocketUseCase } from 'src/socket/usecase';
import { SocketIoAdapter } from 'src/socket/infras/transport';
import Consumer from 'src/brokers/infras/consumer';
import { QueueTypes } from 'src/brokers/transport/queueTypes';

export const orderNameSpaceSocketSetup = (io: Websocket): SocketUseCase => {
  // Order namespace
  const orderIo = io.of(SOCKET_NAMESPACE.ORDER.namespace);
  const socketIoAdapter = new SocketIoAdapter(orderIo);
  const orderSocketUseCase = new SocketUseCase(socketIoAdapter);
  orderIo.on('connection', (socket) => {
    console.log(
      'Admin connected:',
      socket.id,
      io.engine.clientsCount,
      socket.connected
    );
    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id, io.engine.clientsCount);
    });
  });
  return orderSocketUseCase;
};

export const inventoryNameSpaceSocketSetup = (io: Websocket): SocketUseCase => {
  // Inventory namespace
  const inventoryIo = io.of(SOCKET_NAMESPACE.INVENTORY.namespace);
  const inventorySocketIoAdapter = new SocketIoAdapter(inventoryIo);
  const inventorySocketUseCase = new SocketUseCase(inventorySocketIoAdapter);
  inventoryIo.on('connection', (socket) => {
    console.log('Inventory connected:', socket.id, io.engine.clientsCount);

    socket.on('disconnect', () => {
      console.log('Inventory disconnected:', socket.id, io.engine.clientsCount);
    });
  });
  return inventorySocketUseCase;
};
