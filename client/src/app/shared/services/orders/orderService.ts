import {
  OrderCreateDTO,
  OrderConditionDTO,
} from "@/app/shared/interfaces/orders/order.dto";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";
import {
  OrderModel,
  OrderState,
} from "@/app/shared/models/orders/orders.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export const orderService = {
  async getList(
    query: OrderConditionDTO,
  ): Promise<ListResponseModel<OrderModel>> {
    const response = await axiosInstance.get("/order", { params: query });
    return response.data;
  },
  async getOrderDetail(
    order_id: string,
    query: OrderConditionDTO,
  ): Promise<OrderModel> {
    const response = await axiosInstance.get(`/order/${order_id}`, {
      params: query,
    });
    return response.data;
  },
  async updateOrderState(order_id: string, order_state: OrderState) {
    const response = await axiosInstance.put(`/order/${order_id}`, {
      order_state,
    });
    return response.data;
  },
  async updateOrderStatus(order_id: string, order_status: ModelStatus) {
    const response = await axiosInstance.put(`/order/${order_id}`, {
      status: order_status,
    });
    return response.data;
  },
  async softDeleteOrder(order_id: string) {
    const response = await axiosInstance.put(`/order/${order_id}`, {
      status: "DELETED",
    });
    return response.data;
  },
  async deleteOrder(order_id: string) {
    const response = await axiosInstance.delete(`/order/${order_id}`);
    return response.data;
  },
  async createOrder(data: OrderCreateDTO): Promise<OrderModel> {
    const response = await axiosInstance.post("/order", data);
    return response.data;
  },
};
