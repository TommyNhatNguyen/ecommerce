import { SOCKET_NAMESPACE } from 'src/socket/connection/socket-endpoint';

import Websocket from 'src/socket/repo';
let outerIo: Websocket;
export const setupSocket = (io: Websocket) => {
  outerIo = io;
  outerIo.of(SOCKET_NAMESPACE.ORDER.namespace).on('connection', (socket) => {
    console.log('Admin connected:', socket.id, io.engine.clientsCount);

    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id, io.engine.clientsCount);
    });
  });
};

/**
 * -----
 * ORDER
 * -----
 */
export const emitNewOrder = <T>(orderData: T) => {
  if (outerIo) {
    console.log('emitNewOrder', orderData);
    outerIo
      .of(SOCKET_NAMESPACE.ORDER.namespace)
      .emit(
        SOCKET_NAMESPACE.ORDER.endpoints.ORDER_CREATED,
        'New order created'
      ); // Broadcast to all connected admins
  }
};
