import {  VariantProductModel } from "./../../models/variant/variant.model.d";
import { ListResponseModel } from "./../../models/others/list-response.model.d";
import {
  VariantConditionDTO,
  VariantCreateDTO,
} from "../../interfaces/variant/variant.interface";
import { axiosInstance } from "../../utils/axiosInstance";

export const variantServices = {
  create: async (data: VariantCreateDTO): Promise<VariantProductModel> => {
    const response = await axiosInstance.post("/variants", data);
    return response.data;
  },
  getList: async (
    condition?: VariantConditionDTO,
  ): Promise<ListResponseModel<VariantProductModel>> => {
    const response = await axiosInstance.get("/variants", {
      params: condition,
    });
    return response.data;
  },
  delete: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.delete(`/variants/${id}`);
    return response.data;
  },
};
