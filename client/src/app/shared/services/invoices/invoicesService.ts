import { InvoicesConditionDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { InvoicesModel } from "@/app/shared/models/invoices/invoices.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const invoicesService = {
  getList: async (
    condition?: InvoicesConditionDTO,
  ): Promise<ListResponseModel<InvoicesModel>> => {
    const response = await axiosInstance.get("/inventory-invoices", {
      params: condition,
    });
    return response.data;
  },
};
