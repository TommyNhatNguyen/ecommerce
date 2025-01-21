import { NotificationConditionDTO } from "@/app/shared/interfaces/notification/notification.dto";
import { NotificationModel } from "@/app/shared/models/notification/notification.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const notificationServices = {
  async getList(query:NotificationConditionDTO): Promise<ListResponseModel<NotificationModel>> {
    const response = await axiosInstance.get('/message', { params: query });
    return response.data;
  },
};
