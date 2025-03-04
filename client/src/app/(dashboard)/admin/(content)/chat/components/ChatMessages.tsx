import React, { useEffect, useRef } from "react";
import { Avatar, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { IConversation, IMessage } from "@/app/shared/models/chat/chat.model";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import InputAdmin from "@/app/shared/components/InputAdmin";

interface ChatMessagesProps {
  messageList: IMessage[];
  isMessageListLoading: boolean;
  conversation: IConversation;
}

const ChatMessages = ({
  conversation,
  messageList,
  isMessageListLoading,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messageList.map((message) => (
            <div
              key={message._id}
              className={`flex w-full max-w-full ${message.sender === conversation.sender ? "justify-start" : "justify-end"}`}
            >
              <div className="flex max-w-[40%] gap-2">
                {message.sender !== conversation.sender && (
                  <Avatar
                    src={conversation.sender || defaultImage}
                    size={24}
                    className="mt-1"
                  />
                )}
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
        <div className="flex gap-2">
          <InputAdmin
            placeholder="Write a message..."
            className="font-open-sans-regular text-sm"
            size="large"
            style={{ backgroundColor: "var(--bg-primary-color)" }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            className="flex h-10 w-10 items-center justify-center bg-green-200 hover:bg-green-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
