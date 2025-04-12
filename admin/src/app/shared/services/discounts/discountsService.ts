import {
  CreateDiscountDTO,
  DiscountConditionDTO,
  UpdateDiscountDTO,
} from "@/app/shared/interfaces/discounts/discounts.dto";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const discountsService = {
  getDiscounts: async (
    condition: DiscountConditionDTO
  ): Promise<ListResponseModel<DiscountModel>> => {
    const response = await axiosInstance.get("/discounts", { params: condition });
    return response.data;
  },
  createDiscount: async (data: CreateDiscountDTO): Promise<DiscountModel> => {
    const response = await axiosInstance.post("/discounts", data);
    return response.data;
  },
  getDiscountById: async (id: string): Promise<DiscountModel> => {
    const response = await axiosInstance.get(`/discounts/${id}`);
    return response.data;
  },
  updateDiscount: async (
    id: string,
    data: UpdateDiscountDTO,
  ): Promise<DiscountModel> => {
    const response = await axiosInstance.put(`/discounts/${id}`, data);
    return response.data;
  },
  deleteDiscount: async (id: string): Promise<DiscountModel> => {
    const response = await axiosInstance.delete(`/discounts/${id}`);
    return response.data;
  },
};
