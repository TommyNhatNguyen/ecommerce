import { OrderConditionDTO } from "@/app/shared/interfaces/orders/order.dto";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";
import { OrderModel } from "@/app/shared/models/orders/orders.model";

export const orderService = {
  async getList(
    query: OrderConditionDTO,
  ): Promise<ListResponseModel<OrderModel>> {
    const response = await axiosInstance.get("/order", { params: query });
    return response.data;
  },
};
