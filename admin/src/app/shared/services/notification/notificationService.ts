import { NotificationConditionDTO } from "@/app/shared/interfaces/notification/notification.dto";
import { NotificationModel } from "@/app/shared/models/notification/notification.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const notificationServices = {
  async getList(
    query: NotificationConditionDTO,
  ): Promise<ListResponseModel<NotificationModel> & { count_unread: number }> {
    const response = await axiosInstance.get("/message", { params: query });
    return response.data;
  },
  async readNotification(id: string): Promise<boolean> {
    const response = await axiosInstance.put(`/message/${id}`, {
      read_at:  new Date(),
    });
    return response.data;
  },
  async deleteNotification(id: string): Promise<boolean> {
    const response = await axiosInstance.delete(`/message/${id}`);
    return response.data;
  },
};
