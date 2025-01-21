import { CreateShippingDTO, ShippingConditionDTO } from "@/app/shared/interfaces/shipping/shipping.dto";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";

import { ShippingModel } from "@/app/shared/models/shipping/shipping.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const shippingService = {
  async getList(
    query: ShippingConditionDTO,
  ): Promise<ListResponseModel<ShippingModel>> {
    const response = await axiosInstance.get("/shipping", { params: query });
    return response.data;
  },
  async deleteShipping(id: string): Promise<void> {
    const response = await axiosInstance.delete(`/shipping/${id}`);
    return response.data;
  },
  async createShipping(data: CreateShippingDTO): Promise<ShippingModel> {
    const response = await axiosInstance.post("/shipping", data);
    return response.data;
  },
};
