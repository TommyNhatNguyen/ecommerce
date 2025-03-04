import React from "react";
import { Avatar, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isCustomer: boolean;
}

interface Conversation {
  id: number;
  customerName: string;
  avatar: string;
  isOnline: boolean;
  messages: Message[];
}

interface ChatMessagesProps {
  conversation: Conversation | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ conversation }) => {
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
        <Avatar src={conversation.avatar} size={36} />
        <div className="flex flex-col">
          <span className="font-open-sans-medium text-sm text-text-dashboard">
            {conversation.customerName}
          </span>
          <span className="text-xs text-gray-200">
            {conversation.isOnline ? "Active Now" : "Offline"}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isCustomer ? "justify-start" : "justify-end"}`}
            >
              <div className="flex max-w-[70%] gap-2">
                {message.isCustomer && (
                  <Avatar
                    src={conversation.avatar}
                    size={24}
                    className="mt-1"
                  />
                )}
                <div className="flex flex-col gap-1">
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.isCustomer
                        ? "bg-bg-primary text-text-dashboard"
                        : "bg-green-200 text-custom-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-200">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Write a message..."
            className="font-open-sans-regular text-sm"
            size="large"
            bordered={false}
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
