import { Server } from "socket.io";
import { Server as HttpServer } from "http";
const WEBSOCKET_CORS = {
  methods: ["GET", "POST"],
  origin: [
    "https://admin.socket.io",
    "http://localhost:3003",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
  credentials: true,
};

class Websocket extends Server {
  private static io: Websocket;
  constructor(httpServer: HttpServer) {
    super(httpServer, {
      cors: WEBSOCKET_CORS,
    });
  }

  public static getInstance(httpServer: HttpServer): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(httpServer);
    }

    return Websocket.io;
  }
}

export default Websocket;
