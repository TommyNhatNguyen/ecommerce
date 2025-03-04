import React, { useEffect, useRef } from "react";
import { Avatar, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { IConversation, IMessage } from "@/app/shared/models/chat/chat.model";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { useSocket, useSocketPush } from "@/app/shared/hooks/useSocket";
import { SOCKET_EVENTS_ENDPOINT } from "@/app/constants/socket-endpoint";
import { socketServices } from "@/app/shared/services/sockets";
import { useAppSelector } from "@/app/shared/hooks/useRedux";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface ChatMessagesProps {
  messageList: IMessage[];
  isMessageListLoading: boolean;
  conversation: IConversation;
  refetchMessageList: () => void;
}

const ChatMessages = ({
  conversation,
  messageList,
}: ChatMessagesProps) => {
  const { register, handleSubmit, reset, control } = useForm<{
    message: string;
  }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useAppSelector((state) => state.auth);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const _onSendMessage: SubmitHandler<{ message: string }> = (data) => {
    console.log("🚀 ~ data:", data);
    useSocketPush(
      socketServices.chatIo,
      SOCKET_EVENTS_ENDPOINT.CHAT_ADMIN_MESSAGE,
      {
        conversation_id: conversation?._id || "",
        room_id: conversation?.room || "",
        message: data.message || "",
        user_id: userInfo?.id || "admin",
      },
    );
    reset();
  };

  useEffect(() => {
    if (conversation) {
      scrollToBottom();
      useSocketPush(
        socketServices.chatIo,
        SOCKET_EVENTS_ENDPOINT.CHAT_ADMIN_MESSAGE,
        {
          conversation_id: conversation?._id || "",
          room_id: conversation?.room || "",
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
      <div className="flex-1 content-end overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messageList.map((message) => (
            <div
              key={message._id}
              className={`flex w-full max-w-full ${message.sender === conversation.sender ? "justify-start" : "justify-end"}`}
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
          <div ref={messagesEndRef} />
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
