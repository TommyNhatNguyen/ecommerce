import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import { WarehouseCreateDTO } from "@/app/shared/interfaces/warehouse/warehouse.interface";
import { useState } from "react";

export const useWarehouseTable = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);

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

  return {
    loading: isCreateLoading,
    handleCreateWarehouse,
  };
};
