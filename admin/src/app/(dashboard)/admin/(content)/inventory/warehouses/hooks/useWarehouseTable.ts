import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import { WarehouseCreateDTO } from "@/app/shared/interfaces/warehouse/warehouse.interface";
import { useState } from "react";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { productService } from "@/app/shared/services/products/productService";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useIntl } from "react-intl";

export const useWarehouseTable = () => {
const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string[]>([]);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
const { notificationApi } = useNotification();
const intl = useIntl();
  const handleCreateWarehouse = async (data: WarehouseCreateDTO) => {
    try {
      setIsCreateLoading(true);
      const res = await warehouseService.create(data);
      setIsCreateLoading(false);
    } catch (error) {
      console.log("🚀 ~ handleCreateWarehouse ~ error:", error);
    } finally {
      setIsCreateLoading(false);
    }
  };
const handleChangeStatus = async (id: string, status: ModelStatus) => {
  try {
    const response = await warehouseService.update(id, {
      status,
    });
    if (response) {
      notificationApi.success({
        message: intl.formatMessage({ id: "change_status_success" }),
        description: intl.formatMessage({ id: "change_status_success" }),
      });
    }
  } catch (error) {
    notificationApi.error({
      message: intl.formatMessage({ id: "change_status_error" }),
      description: intl.formatMessage({ id: "change_status_error" }),
    });
  }
};
const handleSelectWarehouse = (selectedRowKeys: string[], selectedRows: any[]) => {
  setSelectedWarehouse(selectedRowKeys);
};
const handleDeleteWarehouse = async (id: string) => {
  try {
    setIsDeleteLoading(true);
    const response = await warehouseService.delete(id);
    if (response) {
      notificationApi.success({
        message: intl.formatMessage({ id: "delete_warehouse_success" }),
        description: intl.formatMessage({ id: "delete_warehouse_success" }),
      });
    }
  } catch (error) {
    notificationApi.error({
      message: intl.formatMessage({ id: "delete_warehouse_error" }),
      description: intl.formatMessage({ id: "delete_warehouse_error" }),
    });
  } finally {
    setSelectedWarehouse([])
    setIsDeleteLoading(false);
  }
};
  return {
    loading: isCreateLoading,
    handleCreateWarehouse,
    handleChangeStatus,
    handleSelectWarehouse,
    selectedWarehouse,
    isDeleteLoading,
    handleDeleteWarehouse,
  };
};
