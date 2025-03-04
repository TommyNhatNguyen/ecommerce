export const SOCKET_NAMESPACE = {
  ORDER: {
    namespace: 'order',
    endpoints: {
      ORDER_CREATED: 'order:created',
    },
  },
  INVENTORY: {
    namespace: 'inventory',
    endpoints: {
      LOW_INVENTORY: 'inventory:low_inventory',
    },
  },
  CHAT: {
    namespace: 'chat',
    endpoints: {
      CHAT_MESSAGE: 'chat:message',
      CHAT_ADMIN_NOTIFY: 'chat:admin_notify',
      CHAT_ADMIN_MESSAGE: 'chat:admin_message',
    },
  },
};
