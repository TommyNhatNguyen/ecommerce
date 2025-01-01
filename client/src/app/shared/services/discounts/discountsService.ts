import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";


export const discountsService = {
  getDiscounts: async (): Promise<ListResponseModel<DiscountModel>> => {
    const response = await axiosInstance.get("/discounts");
    return response.data 
  },
  createDiscount: async (data: CreateDiscountDTO): Promise<DiscountModel> => {
    const response = await axiosInstance.post("/discounts", data);
    return response.data 
  },
  deleteDiscount: async (id: string): Promise<DiscountModel> => {
    const response = await axiosInstance.delete(`/discounts/${id}`);
    return response.data;
  },
};
