import { useNotification } from "@/app/contexts/NotificationContext";
import { inventoryService } from "@/app/shared/services/inventory/inventoryService";
import { useState } from "react";

export function useInventorySetting() {
  const [updateThresholdLoading, setUpdateThresholdLoading] = useState(false);
  const [updateThresholdError, setUpdateThresholdError] =
    useState<Error | null>(null);
  const { notificationApi } = useNotification();
  const handleUpdateLowStockThreshold = async (
    id: string,
    threshold: number,
  ) => {
    setUpdateThresholdLoading(true);
    try {
      const response = await inventoryService.updateLowStockThreshold(id, {
        low_stock_threshold: threshold,
      });
      if (response) {
        notificationApi.success({
          message: "Update low stock threshold successfully",
          title: "Success",
        });
      }
    } catch (error) {
      setUpdateThresholdError(error as Error);
      notificationApi.error({
        message: "Update low stock threshold failed",
        title: "Error",
      });
    } finally {
      setUpdateThresholdLoading(false);
    }
  };
  return {
    handleUpdateLowStockThreshold,
    updateThresholdLoading,
    updateThresholdError,
  };
}
