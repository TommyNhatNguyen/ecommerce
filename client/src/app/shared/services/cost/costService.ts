import { CostConditionDTO } from "@/app/shared/interfaces/cost/cost.dto";
import { CostModel } from "@/app/shared/models/cost/cost.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const costService = {
  getList: async (query: CostConditionDTO): Promise<ListResponseModel<CostModel>> => {
    const response = await axiosInstance.get("/cost", { params: query });
    return response.data;
  },
};
