import { IConversation } from "@/app/shared/models/chat/chat.model";
import { chatServices } from "@/app/shared/services/chat/chatServices";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

export const useChat = () => {
  const [conversationCurrentPage, setConversationCurrentPage] =
    useState<number>(1);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation>();

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleSelectConversation = (conversation: IConversation) => {
    setSelectedConversation(conversation);
  };

  const {
    data: conversationList,
    refetch: refetchConversationList,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["conversation", conversationCurrentPage],
    queryFn: ({ pageParam = 1 }) =>
      chatServices.getConversationList({
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });

  const chatSidebarProps = {
    collapsed,
    selectedConversation,
    conversationList:
      conversationList?.pages.flatMap((page) => page.data) || [],
    onCollapse: handleCollapse,
    handleSelectConversation,
    hasNextConversation: hasNextPage,
    fetchNextConversation: fetchNextPage,
  };

  const chatMessagesProps = {
    conversation: selectedConversation,
    refetchConversationList,
  };

  return {
    chatSidebarProps,
    chatMessagesProps,
    collapsed,
  };
};
