import { InventoryUpdateDTO } from "@/app/shared/interfaces/inventories/inventories.dto";
import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const inventoryService = {
  updateLowStockThreshold: async (
    id: string,
    data: InventoryUpdateDTO,
  ): Promise<InventoryModel> => {
    const response = await axiosInstance.put(`/inventories/${id}`, data);
    return response.data;
  },
};
