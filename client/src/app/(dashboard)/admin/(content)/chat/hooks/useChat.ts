import { IConversation } from "@/app/shared/models/chat/chat.model";
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

  const chatSidebarProps = {
    collapsed,
    onCollapse: handleCollapse,
    selectedConversation,
    handleSelectConversation,
  };

  const chatMessagesProps = {
    selectedConversation,
  };

  return {
    chatSidebarProps,
    chatMessagesProps,
    collapsed,
  };
};
