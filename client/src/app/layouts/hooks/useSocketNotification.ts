import { useSocket } from "@/app/shared/hooks/useSocket";
import { socketServices } from "@/app/shared/services/sockets";
import { SOCKET_EVENTS_ENDPOINT } from "@/app/constants/socket-endpoint";
import { useAppDispatch } from "@/app/shared/hooks/useRedux";
import {
  setInventoryLowInventory,
  setOrderCreated,
} from "@/app/shared/store/reducers/socket";
import { getNotificationThunk } from "@/app/shared/store/reducers/notification";
import { ADMIN_ROUTES } from "@/app/constants/routes";

export const useSocketNotifications = (
  pathname: string,
  notificationApi: any,
) => {
  const dispatch = useAppDispatch();

  useSocket(
    socketServices.orderIo,
    [SOCKET_EVENTS_ENDPOINT.ORDER_CREATED],
    (data: string) => {
      const parsedData = JSON.parse(data);
      if (parsedData.from === "order") {
        dispatch(setOrderCreated(parsedData.message));
        dispatch(getNotificationThunk({}));
      }
    },
  );

  useSocket(
    socketServices.inventoryIo,
    [SOCKET_EVENTS_ENDPOINT.INVENTORY_LOW_INVENTORY],
    (data: string) => {
      const parsedData = JSON.parse(data);
      if (parsedData.from === "inventory") {
        dispatch(setInventoryLowInventory(parsedData.message));
        dispatch(getNotificationThunk({}));
      }
    },
  );

  useSocket(
    socketServices.chatIo,
    [SOCKET_EVENTS_ENDPOINT.CHAT_ADMIN_NOTIFY],
    (data: string) => {
      const parsedData = JSON.parse(data);
      console.log("🚀 ~ parsedData:", parsedData)
      if (!pathname.includes(ADMIN_ROUTES.chat)) {
        notificationApi.info({
          message: "New message from customer",
          description: parsedData.message,
        });
      }
      dispatch(getNotificationThunk({}));
    },
  );
};
