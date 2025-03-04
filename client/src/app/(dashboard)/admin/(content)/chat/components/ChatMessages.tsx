import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { IConversation, IMessage } from "@/app/shared/models/chat/chat.model";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { useSocket, useSocketPush } from "@/app/shared/hooks/useSocket";
import { SOCKET_EVENTS_ENDPOINT } from "@/app/constants/socket-endpoint";
import { socketServices } from "@/app/shared/services/sockets";
import { useAppSelector } from "@/app/shared/hooks/useRedux";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { keepPreviousData } from "@tanstack/react-query";
import { chatServices } from "@/app/shared/services/chat/chatServices";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatMessagesProps {
  conversation?: IConversation;
}

const ChatMessages = ({ conversation }: ChatMessagesProps) => {
  const [renderMessages, setRenderMessages] = useState<IMessage[]>([]);
  const { handleSubmit, reset, control } = useForm<{ message: string }>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottom = useRef(true);
  const { userInfo } = useAppSelector((state) => state.auth);

  const {
    data: messagePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["messages", conversation?._id],
    queryFn: ({ pageParam = 1 }) =>
      chatServices.getMessageListByConversationId(conversation?._id || "", {
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    enabled: !!conversation?._id,
  });
  console.log("🚀 ~ ChatMessages ~ messagePages:", messagePages);

  useEffect(() => {
    if (messagePages) {
      const reversedMessages = [];
      for (let i = (messagePages.pages as any).length - 1; i >= 0; i--) {
        const page = messagePages.pages[i].data;
        reversedMessages.push(...page);
      }
      setRenderMessages(reversedMessages);
      setTimeout(() => {
        if (shouldScrollToBottom.current) {
          scrollToBottom();
        }
      }, 100);
    }
  }, [messagePages]);

  const scrollToBottom = () => {
    if (shouldScrollToBottom.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      shouldScrollToBottom.current = false;
      fetchNextPage();
    }

    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100;
    shouldScrollToBottom.current = isAtBottom;
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    if (conversation) {
      shouldScrollToBottom.current = true;
      useSocketPush(
        socketServices.chatIo,
        SOCKET_EVENTS_ENDPOINT.CHAT_ADMIN_MESSAGE,
        {
          conversation_id: conversation._id,
          room_id: conversation.room,
          message: "join-room",
          user_id: userInfo?.id || "admin",
        },
      );
    }
    return () => {
      useSocketPush(
        socketServices.chatIo,
        SOCKET_EVENTS_ENDPOINT.CHAT_ADMIN_MESSAGE,
        {
          conversation_id: conversation?._id || "",
          room_id: conversation?.room || "",
          message: "leave-room",
          user_id: userInfo?.id || "admin",
        },
      );
    };
  }, [conversation]);

  useSocket(
    socketServices.chatIo,
    [SOCKET_EVENTS_ENDPOINT.CHAT_ADMIN_NOTIFY],
    (data: string) => {
      const parsedData: { from: string; message: string } = JSON.parse(data);
      shouldScrollToBottom.current = true;
      scrollToBottom();
      refetch();
    },
  );

  const _onSendMessage: SubmitHandler<{ message: string }> = (data) => {
    useSocketPush(
      socketServices.chatIo,
      SOCKET_EVENTS_ENDPOINT.CHAT_ADMIN_MESSAGE,
      {
        conversation_id: conversation?._id || "",
        room_id: conversation?.room || "",
        message: data.message,
        user_id: userInfo?.id || "admin",
      },
    );
    shouldScrollToBottom.current = true;
    scrollToBottom();
    setTimeout(() => {
      refetch();
    }, 100);
    reset();
  };

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-bg-dashboard text-gray-200">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-bg-dashboard">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <Avatar src={conversation.sender || defaultImage} size={36} />
        <div className="flex flex-col">
          <span className="font-open-sans-medium text-sm text-text-dashboard">
            {conversation.sender}
          </span>
          <span className="text-xs text-gray-200">
            {new Date(
              conversation.latestMessageCreatedAt || conversation.createdAt,
            ).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 content-end overflow-y-auto p-4"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        <div className="flex flex-col gap-3">
          {renderMessages.map((message) => (
            <div
              key={message._id}
              className={`flex w-full max-w-full ${
                message.sender === conversation.sender
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div className="flex max-w-[40%] gap-2">
                <div className="flex max-w-full flex-col gap-1">
                  <div
                    className={`max-w-full whitespace-pre-wrap text-wrap break-words rounded-2xl px-4 py-2 ${
                      message.sender === conversation.sender
                        ? "bg-bg-primary text-text-dashboard"
                        : "bg-green-200 text-custom-white"
                    }`}
                  >
                    <p className="max-w-full whitespace-pre-wrap text-wrap break-words text-sm">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-gray-200">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="relative gap-2">
          <Controller
            control={control}
            name="message"
            render={({ field }) => (
              <InputAdmin
                placeholder="Write a message..."
                size="large"
                className="bg-bg-primary-color text-sm"
                {...field}
              />
            )}
          />
          <Button
            type="text"
            icon={<SendOutlined />}
            className="absolute right-2 top-1/2 flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-green-300"
            onClick={handleSubmit(_onSendMessage)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
