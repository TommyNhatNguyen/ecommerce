"use client";
import React, { useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatMessages from "./components/ChatMessages";
import { useChat } from "@/app/(dashboard)/admin/(content)/chat/hooks/useChat";

const ChatPage = () => {
  const { chatSidebarProps, chatMessagesProps, collapsed } = useChat();
  return (
    <div className="flex h-full">
      <div
        className={`${collapsed ? "w-20" : "w-1/5 min-w-[30%]"} flex-shrink-0 border-r border-solid border-gray-100 transition-all duration-200`}
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
