import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

export const socketServices = {
  orderIo: io(`${URL}/order`, {
    autoConnect: false,
  }),
};
