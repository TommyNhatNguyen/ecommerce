import { notification } from "antd";
import React from "react";

type Props = {
  children: React.ReactNode;
};

// Add NotificationInstance type from antd
type NotificationContextType = {
  notificationApi: ReturnType<typeof notification.useNotification>[0];
};

// Update context with proper type
export const NotificationContext =
  React.createContext<NotificationContextType | null>(null);

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

export const useNotification = (): NotificationContextType => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationContextProvider",
    );
  }
  return context;
};

export default NotificationContextProvider;
