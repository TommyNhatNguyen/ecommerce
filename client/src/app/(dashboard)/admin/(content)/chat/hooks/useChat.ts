import { IConversation } from "@/app/shared/models/chat/chat.model";
import { chatServices } from "@/app/shared/services/chat/chatServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useChat = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation>();

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleSelectConversation = (conversation: IConversation) => {
    setSelectedConversation(conversation);
  };

  const { data: messageList, isLoading: isMessageListLoading } = useQuery({
    queryKey: ["messageList", selectedConversation?._id],
    queryFn: () =>
      chatServices.getMessageListByConversationId(
        selectedConversation?._id || "",
        {
          limit: 10,
          page: 1,
        },
      ),
  });

  const chatSidebarProps = {
    collapsed,
    onCollapse: handleCollapse,
    selectedConversation,
    handleSelectConversation,
  };

  const chatMessagesProps = {
    messageList: messageList?.data || [],
    isMessageListLoading,
    conversation: selectedConversation,
  };

  return {
    chatSidebarProps,
    chatMessagesProps,
    collapsed,
  };
};
