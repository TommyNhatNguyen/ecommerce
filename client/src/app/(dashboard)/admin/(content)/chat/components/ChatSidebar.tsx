"use client";
import React, { useState } from "react";
import { Input, Button, Avatar, Tooltip } from "antd";
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
import { IConversation } from "@/app/shared/models/chat/chat.model";
import { defaultImage } from "@/app/shared/resources/images/default-image";

interface ChatSidebarProps {
  collapsed: boolean;
  onCollapse?: (collapsed: boolean) => void;
  selectedConversation: IConversation | undefined;
  handleSelectConversation: (conversation: IConversation) => void;
}
// This would typically come from your data source
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
  const _onSelectConversation = (conversation: IConversation) => {
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
          {conversationList?.data &&
            conversationList.data.map((item) => (
              <Button
                type="text"
                key={item._id}
                className={cn(
                  "h-btn cursor-pointer transition-colors hover:bg-bg-primary-60",
                  selectedConversation?._id === item._id && "bg-bg-primary-60",
                  collapsed
                    ? "flex w-full items-center justify-center py-4"
                    : "px-4 py-3",
                )}
                onClick={() => _onSelectConversation(item)}
              >
                {collapsed ? (
                  <Tooltip
                    title={
                      <div className="flex flex-col gap-1">
                        <p className="max-w-full text-sm text-white">
                          <span className="font-bold">Customer name: </span>
                          {item.sender}
                        </p>
                        <p className="max-w-full text-xs text-white">
                          <span className="font-bold">Last message: </span>
                          {new Date(
                            item?.latestMessageCreatedAt || item.createdAt,
                          ).toLocaleString()}
                        </p>
                      </div>
                    }
                  >
                    <Avatar
                      src={item.sender || defaultImage}
                      size={28}
                      className="flex-shrink-0"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={
                      <div className="flex flex-col gap-1">
                        <p className="max-w-full text-sm text-white">
                          <span className="font-bold">Customer name: </span>
                          {item.sender}
                        </p>
                        <p className="max-w-full text-xs text-white">
                          <span className="font-bold">Last message: </span>
                          {new Date(
                            item?.latestMessageCreatedAt || item.createdAt,
                          ).toLocaleString()}
                        </p>
                      </div>
                    }
                    className="flex max-w-full items-center gap-3"
                  >
                    <Avatar
                      src={item.sender || defaultImage}
                      size={28}
                      className="flex-shrink-0"
                    />
                    <div className="flex max-w-[50%] flex-col items-start gap-1">
                      <span className="max-w-full truncate text-sm text-text-dashboard">
                        {item.sender}
                      </span>
                      <span className="max-w-full truncate text-xs text-gray-200">
                        {item.latestMessage?.content || "Say hi to customer"}
                      </span>
                    </div>
                    <span className="max-w-full flex-1 flex-shrink-0 truncate text-xs text-gray-200">
                      {new Date(
                        item?.latestMessageCreatedAt || item.createdAt,
                      ).toLocaleString()}
                    </span>
                  </Tooltip>
                )}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
