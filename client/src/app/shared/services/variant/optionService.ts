import { OptionConditionDTO, OptionValueConditionDTO } from "@/app/shared/interfaces/variant/variant.interface";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { OptionModel, OptionValueModel } from "@/app/shared/models/variant/variant.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const optionService = {
  getOptionValuesList: async (condition: OptionValueConditionDTO) : Promise<ListResponseModel<OptionValueModel>> => {
    const response = await axiosInstance.get(`/options-values`, {
      params: condition,
    });
    return response.data;
  },
  getOptionList: async (condition: OptionConditionDTO) : Promise<ListResponseModel<OptionModel>> => {
    const response = await axiosInstance.get(`/options`, {
      params: condition,
    });
    return response.data;
  },
};
