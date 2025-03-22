import { InvoicesConditionDTO, InvoicesCreateDTO, TransferInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
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
  create: async (data: InvoicesCreateDTO): Promise<InvoicesModel> => {
    const response = await axiosInstance.post("/inventory-invoices", data);
    return response.data;
  },
  createTransfer: async (data: TransferInvoicesCreateDTO): Promise<InvoicesModel> => {
    const response = await axiosInstance.post("/inventory-invoices/transfer", data);
    return response.data;
  },
};
