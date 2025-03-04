"use client";
import React, { useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatMessages from "./components/ChatMessages";
import { useChat } from "@/app/(dashboard)/admin/(content)/chat/hooks/useChat";

const mockConversation = {
  id: 1,
  customerName: "John Doe",
  avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1",
  isOnline: true,
  messages: [
    {
      id: 1,
      content: "Hello, I need help with my order",
      timestamp: "10:30 AM",
      isCustomer: true,
    },
    {
      id: 2,
      content:
        "Hi John, I'd be happy to help. Could you please provide your order number?",
      timestamp: "10:31 AM",
      isCustomer: false,
    },
    {
      id: 3,
      content: "Sure, it's #12345",
      timestamp: "10:32 AM",
      isCustomer: true,
    },
    {
      id: 4,
      content: "Thank you. Let me check that for you.",
      timestamp: "10:33 AM",
      isCustomer: false,
    },
  ],
};

const ChatPage = () => {
  const { chatSidebarProps, chatMessagesProps, collapsed } = useChat();
  return (
    <div className="flex h-full">
      <div
        className={`${collapsed ? "w-20" : "w-1/5 min-w-[200px]"} flex-shrink-0 border-r border-solid border-gray-100 transition-all duration-200`}
      >
        <ChatSidebar {...chatSidebarProps} />
      </div>
      <div className="flex-1">
        <ChatMessages {...chatMessagesProps} />
      </div>
    </div>
  );
};

export default ChatPage;
