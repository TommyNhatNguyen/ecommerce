import { notification } from "antd";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const NotificationContext = React.createContext<any>(null);

const NotificationContextProvider = ({ children }: Props) => {
  const [api, contextHolder] = notification.useNotification({
    pauseOnHover: true,
    placement: "topRight",
  });
  const notificationApi = api;
  return (
    <NotificationContext.Provider value={{ notificationApi }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return React.useContext(NotificationContext);
};

export default NotificationContextProvider;
