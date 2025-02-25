import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

export const socketServices = {
  socketIo: io(`${URL}`, {
    autoConnect: true,
  }),
  orderIo: io(`${URL}/order`, {
    autoConnect: true,
  }),
  inventoryIo: io(`${URL}/inventory`, {
    autoConnect: true,
  }),
};

console.log(socketServices.orderIo);