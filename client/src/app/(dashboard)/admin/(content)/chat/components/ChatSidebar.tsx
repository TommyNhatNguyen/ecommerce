"use client";
import React, { useState } from "react";
import { Input, Button, Avatar } from "antd";
import {
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { useForm } from "react-hook-form";
import { cn } from "@/app/shared/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { chatServices } from "@/app/shared/services/chat/chatServices";

interface ChatSidebarProps {
  collapsed: boolean;
  onCollapse?: (collapsed: boolean) => void;
  selectedConversation: string;
  handleSelectConversation: (conversation: any) => void;
}
// This would typically come from your data source
const conversations = [
  {
    id: 1,
    customerName: "John Doe",
    lastMessage: "Hello, I need help with my order",
    timestamp: "10:30 AM",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=1",
  },
  {
    id: 2,
    customerName: "Sarah Wilson",
    lastMessage: "Thanks for your quick response!",
    timestamp: "9:45 AM",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
  },
  {
    id: 3,
    customerName: "Michael Brown",
    lastMessage: "When will my package arrive?",
    timestamp: "Yesterday",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=3",
  },
  {
    id: 4,
    customerName: "Emma Thompson",
    lastMessage: "I'd like to request a refund for my recent purchase",
    timestamp: "Yesterday",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=4",
  },
  {
    id: 5,
    customerName: "David Garcia",
    lastMessage: "Is this item still available in blue?",
    timestamp: "2 days ago",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=5",
  },
  {
    id: 6,
    customerName: "Lisa Anderson",
    lastMessage: "Perfect, thank you for the information",
    timestamp: "2 days ago",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=6",
  },
];
const ChatSidebar = ({
  collapsed,
  onCollapse,
  selectedConversation,
  handleSelectConversation,
}: ChatSidebarProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const _onCollapse = () => {
    onCollapse?.(!collapsed);
  };
  const _onSelectConversation = (conversation: any) => {
    handleSelectConversation(conversation);
  };

  const { data: conversationList } = useQuery({
    queryKey: ["conversation", currentPage, limit],
    queryFn: () =>
      chatServices.getConversationList({
        page: currentPage,
        limit,
      }),
  });
  console.log("🚀 ~ conversationList:", conversationList);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-gray-200 p-2">
        {!collapsed && (
          <InputAdmin
            placeholder="Search conversations"
            prefix={<SearchOutlined className="text-gray-200" />}
            className="flex-1"
          />
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={_onCollapse}
          className={cn(
            `m-auto flex h-fit w-fit items-center justify-center text-gray-200 hover:text-gray-300`,
            collapsed && "w-full",
          )}
          size="small"
        />
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2 pr-2">
          {conversations.map((item) => (
            <Button
              type="text"
              key={item.id}
              className={cn(
                "h-btn cursor-pointer transition-colors hover:bg-bg-primary-60",
                selectedConversation.id === item.id && "bg-bg-primary-60",
                collapsed
                  ? "flex w-full items-center justify-center py-4"
                  : "px-4 py-3",
              )}
              onClick={() => _onSelectConversation(item)}
            >
              {collapsed ? (
                <div className="flex w-full items-center justify-center">
                  <Avatar
                    src={item.avatar}
                    size={28}
                    className="flex-shrink-0"
                  />
                </div>
              ) : (
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Avatar
                      src={item.avatar}
                      size={28}
                      className="flex-shrink-0"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm text-text-dashboard">
                        {item.customerName}
                      </span>
                      <span className="truncate text-xs text-gray-200">
                        {item.lastMessage}
                      </span>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-xs text-gray-200">
                    {item.timestamp}
                  </span>
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
