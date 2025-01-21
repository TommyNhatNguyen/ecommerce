import { OrderTableDataType } from "@/app/(dashboard)/admin/orders/components/OrderTable";
import { OrderState } from "@/app/shared/models/orders/orders.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { orderService } from "@/app/shared/services/orders/orderService";
import { useState } from "react";

export default function useOrder() {
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
    } catch (error) {
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
    } catch (error) {
      setIsUpdateOrderStatusError(true);
    } finally {
      setIsUpdateOrderStatusLoading(false);
    }
  };
  const handleSoftDeleteOrder = async (order_id: string) => {
    setIsSoftDeleteOrderLoading(true);
    try {
      await orderService.softDeleteOrder(order_id);
    } catch (error) {
      setIsSoftDeleteOrderError(true);
    } finally {
      setIsSoftDeleteOrderLoading(false);
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
  };
  const orderStatisticsProps = {};
  return {
    orderTableProps,
    orderStatisticsProps,
  };
}
