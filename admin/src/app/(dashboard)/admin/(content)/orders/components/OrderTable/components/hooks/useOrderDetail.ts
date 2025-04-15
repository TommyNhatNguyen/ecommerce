import { OrderUpdateDTO } from "@/app/shared/interfaces/orders/order.dto";
import { useState } from "react";
import { orderService } from "@/app/shared/services/orders/orderService";
import { useNotification } from "@/app/contexts/NotificationContext";

export const useOrderDetail = () => {
  const [isConfirmOrderLoading, setIsConfirmOrderLoading] = useState(false);
  const { notificationApi } = useNotification();
  const handleConfirmOrder = async (order_id: string, data: OrderUpdateDTO) => {
    try {
      setIsConfirmOrderLoading(true);
      const response = await orderService.confirmOrder(order_id, data);
      if (response) {
        notificationApi.success({
          message: "Đơn hàng đã được xác nhận",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Đơn hàng không được xác nhận",
      });
    } finally {
      setIsConfirmOrderLoading(false);
    }
  };

  return {
    isConfirmOrderLoading,
    handleConfirmOrder,
  };
};
