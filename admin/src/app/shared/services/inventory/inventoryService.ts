import { InventoryConditionDTO, InventoryUpdateDTO } from "@/app/shared/interfaces/inventories/inventories.dto";
import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const inventoryService = {
  updateLowStockThreshold: async (
    id: string,
    data: InventoryUpdateDTO,
  ): Promise<InventoryModel> => {
    const response = await axiosInstance.put(`/inventories/${id}`, data);
    return response.data;
  },
  list: async (condition?: InventoryConditionDTO): Promise<ListResponseModel<InventoryModel>> => {
    const response = await axiosInstance.get("/inventories", { params: condition });
    return response.data;
  },
  getInventoryById: async (id: string, condition?: InventoryConditionDTO): Promise<InventoryModel> => {
    const response = await axiosInstance.get(`/inventories/${id}`, { params: condition });
    return response.data;
  },
};
