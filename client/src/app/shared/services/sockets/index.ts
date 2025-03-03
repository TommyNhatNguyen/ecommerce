import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

export const socketServices = {
  socketIo: io(`${URL}`, {
    autoConnect: false,
  }),
  orderIo: io(`${URL}/order`, {
    autoConnect: false,
  }),
  inventoryIo: io(`${URL}/inventory`, {
    autoConnect: false,
  }),
  chatIo: io(`${URL}/chat`, {
    autoConnect: false,
  }),
};
