import Websocket from 'src/share/modules/websocket';

let outerIo: Websocket;
export const setupSocket = (io: Websocket) => {
  outerIo = io;
  outerIo.of('order').on('connection', (socket) => {
    console.log('Admin connected:', socket.id, io.engine.clientsCount);

    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id, io.engine.clientsCount);
    });
  });
};

export const emitNewOrder = <T>(orderData: T) => {
  if (outerIo) {
    console.log("emitNewOrder", orderData);
    outerIo.of('order').emit('order:created', "New order created"); // Broadcast to all connected admins
  }
};
