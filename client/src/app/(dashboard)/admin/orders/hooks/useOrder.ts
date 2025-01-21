import { OrderTableDataType } from "@/app/(dashboard)/admin/orders/components/OrderTable";
import { useNotification } from "@/app/contexts/NotificationContext";
import { OrderState } from "@/app/shared/models/orders/orders.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { orderService } from "@/app/shared/services/orders/orderService";
import { title } from "process";
import { useState } from "react";

export default function useOrder(orderState: OrderState | null = null) {
  const [isUpdateOrderStateLoading, setIsUpdateOrderStateLoading] =
    useState(false);
  const [isUpdateOrderStateError, setIsUpdateOrderStateError] = useState(false);
  const [isUpdateOrderStatusLoading, setIsUpdateOrderStatusLoading] =
    useState(false);
  const [isUpdateOrderStatusError, setIsUpdateOrderStatusError] =
    useState(false);
  const [selectedRows, setSelectedRows] = useState<OrderTableDataType[]>([]);
  const [isSoftDeleteOrderLoading, setIsSoftDeleteOrderLoading] =
    useState(false);
  const [isSoftDeleteOrderError, setIsSoftDeleteOrderError] = useState(false);
  const [isDeleteOrderLoading, setIsDeleteOrderLoading] = useState(false);
  const [isDeleteOrderError, setIsDeleteOrderError] = useState(false);
  const { notificationApi } = useNotification();
  const handleSelectAllRow = (
    selected: boolean,
    selectedRows: OrderTableDataType[],
    changeRows: OrderTableDataType[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const handleSelectRow = (
    record: OrderTableDataType,
    selected: boolean,
    selectedRows: OrderTableDataType[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const handleChangeOrderState = async (
    order_id: string,
    order_state: OrderState,
  ) => {
    setIsUpdateOrderStateLoading(true);
    try {
      await orderService.updateOrderState(order_id, order_state);
      notificationApi.success({
        message: "Order state updated successfully",
        description: "Order state updated successfully",
      });
    } catch (error) {
      notificationApi.error({
        message: "Failed to update order state",
        description: "Failed to update order state",
      });
      setIsUpdateOrderStateError(true);
    } finally {
      setIsUpdateOrderStateLoading(false);
    }
  };
  const handleChangeOrderStatus = async (
    order_id: string,
    order_status: ModelStatus,
  ) => {
    setIsUpdateOrderStatusLoading(true);
    try {
      await orderService.updateOrderStatus(order_id, order_status);
      notificationApi.success({
        message: "Order status updated successfully",
        description: "Order status updated successfully",
      });
    } catch (error) {
      notificationApi.error({
        message: "Failed to update order status",
        description: "Failed to update order status",
      });
      setIsUpdateOrderStatusError(true);
    } finally {
      setIsUpdateOrderStatusLoading(false);
    }
  };
  const handleSoftDeleteOrder = async (order_id: string) => {
    setIsSoftDeleteOrderLoading(true);
    try {
      await orderService.softDeleteOrder(order_id);
      notificationApi.success({
        message: "Order deleted successfully",
        description: "Order deleted successfully",
      });
    } catch (error) {
      notificationApi.error({
        message: "Failed to delete order",
        description: "Failed to delete order",
      });
      setIsSoftDeleteOrderError(true);
    } finally {
      setIsSoftDeleteOrderLoading(false);
    }
  };
  const handleDeleteOrder = async (order_id: string) => {
    setIsDeleteOrderLoading(true);
    try {
      await orderService.deleteOrder(order_id);
      notificationApi.success({
        message: "Order deleted successfully",
        description: "Order deleted successfully",
      });
    } catch (error) {
      notificationApi.error({
        message: "Failed to delete order",
        description: "Failed to delete order",
      });
      setIsDeleteOrderError(true);
    } finally {
      setIsDeleteOrderLoading(false);
    }
  };
  const orderTableProps = {
    handleSelectAllRow,
    handleSelectRow,
    handleSoftDeleteOrder,
    handleChangeOrderState,
    isUpdateOrderStateLoading,
    handleChangeOrderStatus,
    isUpdateOrderStatusLoading,
    selectedRows,
    isSoftDeleteOrderLoading,
    isSoftDeleteOrderError,
    orderState,
    handleDeleteOrder,
    isDeleteOrderLoading,
    isDeleteOrderError,
  };
  const orderStatisticsProps = {};
  return {
    orderTableProps,
    orderStatisticsProps,
  };
}
