import { OptionConditionDTO, OptionCreateDTO, OptionUpdateDTO, OptionValueConditionDTO } from "@/app/shared/interfaces/variant/variant.interface";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { OptionModel, OptionValueModel } from "@/app/shared/models/variant/variant.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const optionService = {
  getOptionValuesList: async (
    condition: OptionValueConditionDTO,
  ): Promise<ListResponseModel<OptionValueModel>> => {
    const response = await axiosInstance.get(`/options-values`, {
      params: condition,
    });
    return response.data;
  },
  getOptionList: async (
    condition: OptionConditionDTO,
  ): Promise<ListResponseModel<OptionModel>> => {
    const response = await axiosInstance.get(`/options`, {
      params: condition,
    });
    return response.data;
  },
  createOption: async (data: OptionCreateDTO): Promise<OptionModel> => {
    const response = await axiosInstance.post(`/options`, data);
    return response.data;
  },
  getAllOptions: async (
    condition: OptionConditionDTO,
  ): Promise<{ data: OptionModel[] }> => {
    const response = await axiosInstance.get(`/options/all`, {
      params: condition,
    });
    return response.data;
  },
  getOptionById: async (
    id: string,
    condition?: OptionConditionDTO,
  ): Promise<OptionModel> => {
    const response = await axiosInstance.get(`/options/${id}`, {
      params: condition,
    });
    return response.data;
  },
  updateOption: async (
    id: string,
    data: OptionUpdateDTO,
  ): Promise<OptionModel> => {
    const response = await axiosInstance.put(`/options/${id}`, data);
    return response.data;
  },
};
