import { useState } from "react";

export const useChat = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] = useState<any>("");

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleSelectConversation = (conversation: any) => {
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
