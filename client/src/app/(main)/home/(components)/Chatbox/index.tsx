"use client";
import Button from "@/app/shared/components/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Phone, Send, X } from "lucide-react";
import React, { useState } from "react";
import { Message, GroupedMessages, MessageListProps } from "./types";
import { Input } from "@/components/ui/input";
import Form from "@/app/shared/components/Form";
import { socketServices } from "@/app/shared/services/sockets";
import { SOCKET_EVENTS_ENDPOINT } from "@/app/constants/socket-endpoint";
import { useSocketPush } from "@/app/shared/hooks/useSocket";
import { useCustomerAppSelector } from "@/app/shared/hooks/useRedux";

type Props = {};

const messages = [
  {
    id: 1,
    text: "Hello!",
    sent: false,
    timestamp: "2024-03-20T09:41:00",
  },
  {
    id: 2,
    text: "Hi there!",
    sent: true,
    timestamp: "2024-03-20T09:42:00",
  },
  {
    id: 3,
    text: "How are you?",
    sent: false,
    timestamp: "2024-03-20T09:43:00",
  },
  {
    id: 4,
    text: "I'm good, thank you!",
    sent: true,
    timestamp: "2024-03-20T09:44:00",
  },
  {
    id: 5,
    text: "What's your name?",
    sent: false,
    timestamp: "2024-03-20T09:45:00",
  },
  {
    id: 6,
    text: "My name is John Doe.",
    sent: true,
    timestamp: "2024-03-20T09:46:00",
  },
  {
    id: 7,
    text: "Nice to meet you!",
    sent: false,
    timestamp: "2024-03-20T09:47:00",
  },
  {
    id: 8,
    text: "What's your favorite color?",
    sent: true,
    timestamp: "2024-03-20T09:48:00",
  },
  {
    id: 9,
    text: "I like blue.",
    sent: false,
    timestamp: "2024-03-20T09:49:00",
  },
];

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const groupMessagesByDate = (messages: Message[]): GroupedMessages => {
    return messages.reduce((groups: GroupedMessages, message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col space-y-4 p-4">
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-body-sub text-gray-400">{date}</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start ${
                message.sent ? "justify-end" : ""
              } mb-4`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sent ? "bg-green-300" : "bg-bg-primary"
                }`}
              >
                <p
                  className={`text-body-sub ${
                    message.sent ? "text-white" : "text-gray-400"
                  }`}
                >
                  {message.text}
                </p>
                <span
                  className={`mt-1 text-sm ${
                    message.sent ? "text-white" : "text-gray-400"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ChatBox = (props: Props) => {
  const [isShowChatBox, setIsShowChatBox] = useState(false);
  const [message, setMessage] = useState("");
  const { customerInfo } = useCustomerAppSelector((state) => state.auth);
  const _onToggleChatBox = () => {
    setIsShowChatBox((prev) => !prev);
  };
  const _onCloseChatBox = () => {
    setIsShowChatBox(false);
  };
  const _onChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const _onSendMessage = () => {
    console.log("🚀 ~ _onSendMessage ~ message:", message);
    socketServices.chatIo.emit(SOCKET_EVENTS_ENDPOINT.CHAT_MESSAGE, {
      message,
      user_id: customerInfo?.id,
    });
  };
  return (
    <div className="fixed bottom-28 right-28 z-50">
      {/* Message Button */}
      <Button
        className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-bg-secondary p-2 shadow-md"
        onClick={_onToggleChatBox}
      >
        <MessageCircle className="h-10 w-10" />
      </Button>
      {/* Chat Box */}
      {isShowChatBox && (
        <div className="absolute -bottom-2 -right-6 flex h-full min-h-[400px] w-full min-w-[300px] flex-col gap-2 rounded-lg bg-white shadow-md">
          {/* Header */}
          <div className="header flex h-fit w-full items-center justify-between border-b border-solid border-gray-200 px-4 py-2">
            {/* Host information */}
            <div className="host-information flex items-center gap-2">
              <div className="host-avatar">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="host-name">
                <p className="font-roboto-bold text-body-big">John Doe</p>
                <p className="ml-1 text-body-sub text-gray-500">Host</p>
              </div>
            </div>
            {/* Phone call and close button */}
            <div className="actions flex items-center gap-4">
              <a href="tel:+84909284493" className="phone-call">
                <Phone className="h-8 w-8" />
              </a>
              <Button
                variant="icon"
                classes="bg-transparent group"
                onClick={_onCloseChatBox}
              >
                <X className="h-8 w-8 text-green-300 duration-300 group-hover:text-white" />
              </Button>
            </div>
          </div>
          {/* Body */}
          <div className="h-full w-full overflow-y-auto">
            <MessageList messages={messages} />
          </div>
          {/* Footer */}
          <div className="footer flex items-center justify-between border-t border-solid border-gray-200 px-4 py-2">
            <Form.Input
              wrapperClasses="border-none relative flex gap-4 h-full w-full items-center rounded-full bg-bg-primary-60 px-4"
              inputClasses="h-full w-full rounded-full bg-transparent px-2 placeholder:text-gray-400"
              placeholder="Chat with us to get more information..."
              onChange={_onChangeMessage}
              value={message}
              renderIcon={() => (
                <Button variant="icon" classes="h-10" onClick={_onSendMessage}>
                  <Send className="h-1/2 w-1/2" />
                </Button>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
