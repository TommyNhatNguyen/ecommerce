import { CustomerConditionDTO } from "../../interfaces/customers/customers.dto";
import { CustomerModel } from "./../../models/customers/customers.model.d";
import { ListResponseModel } from "../../models/others/list-response.model";
import { axiosInstance } from "../../utils/axiosInstance";

export const customerService = {
  async getList(
    condition?: CustomerConditionDTO,
  ): Promise<ListResponseModel<CustomerModel>> {
    const response = await axiosInstance.get("/customer", {
        params: condition
    });
    return response.data;
  },
};
