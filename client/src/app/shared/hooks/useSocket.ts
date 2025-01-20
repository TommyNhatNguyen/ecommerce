import { useEffect } from "react";
import { socket } from "@/app/shared/utils/socket";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { Socket } from "socket.io-client";
import { setIsConnected } from "@/app/shared/store/reducers/socket";

export const useSocket = (
  socket: Socket,
  connectionEvent: string,
  callback: (data: any) => void,
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      dispatch(setIsConnected(true));
      console.group("socket", socket.connected);
    }
    return () => {
      socket.disconnect();
      dispatch(setIsConnected(false));
      console.group("socket", socket.connected);
    };
  }, []);

  useEffect(() => {
    socket.on(connectionEvent, callback);
    return () => {
      socket.off(connectionEvent);
    };
  }, []);
};

export const useSocketPush = (socket: Socket, event: string, data: any) => {
  socket.emit(event, data);
};
