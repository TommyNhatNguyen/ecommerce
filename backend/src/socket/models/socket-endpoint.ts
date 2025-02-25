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
};
