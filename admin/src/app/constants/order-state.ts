import { OrderState } from "@/app/shared/models/orders/orders.model";

export const ORDER_STATE: Record<OrderState, string> = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
  RETURNED: "RETURNED",
  EXPIRED: "EXPIRED",
  CANCELLED_BY_ADMIN: "CANCELLED_BY_ADMIN",
};

export const ORDER_STATE_COLOR: Record<string, string> = {
  PENDING: "text-yellow-500",
  CONFIRMED: "text-blue-500",
  SHIPPED: "text-green-500",
  DELIVERED: "text-green-500",
  CANCELLED: "text-red-500",
  FAILED: "text-red-500",
  RETURNED: "text-red-500",
  EXPIRED: "text-red-500",
  CANCELLED_BY_ADMIN: "text-red-500",
};
