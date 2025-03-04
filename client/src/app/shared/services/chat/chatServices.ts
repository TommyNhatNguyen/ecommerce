import { IConversationConditionDTO, IMessageConditionDTO } from "@/app/shared/interfaces/chat/chat.interface";
import { IConversation, IMessage } from "@/app/shared/models/chat/chat.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const chatServices = {
  getConversationList: async (
    condition?: IConversationConditionDTO,
  ): Promise<ListResponseModel<IConversation>> => {
    const response = await axiosInstance.get("/conversation", {
      params: {
        condition,
      },
    });
    return response.data;
  },
  getMessageListByConversationId: async (
    conversationId: string,
    condition?: IMessageConditionDTO,
  ): Promise<ListResponseModel<IMessage>> => {
    const response = await axiosInstance.get(`/conversation/${conversationId}/message`, {
      params: { condition },
    });
    return response.data;
  },
};
