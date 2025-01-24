"use client";

import { Bell, Check, Dot, Trash } from "lucide-react";
import { Badge, Button, List } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import {
  deleteNotificationThunk,
  getNotificationThunk,
  readNotificationThunk,
} from "@/app/shared/store/reducers/notification";
import { cn } from "@/lib/utils";
import { useNotification } from "@/app/contexts/NotificationContext";

type Props = {};

const Notification = (props: Props) => {
  const { notificationApi } = useNotification();
  const [isShowNotification, setIsShowNotification] = useState(false);
  const { notificationList, isLoading, error, isReadSuccess, isDeleteSuccess } =
    useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();
  const { count_unread, data, meta } = notificationList;
  const _onReadNotification = (id: string) => {
    dispatch(readNotificationThunk(id));
  };
  const _onDeleteNotification = (id: string) => {
    dispatch(deleteNotificationThunk(id));
  };
  const _onToggleNotification = () => {
    if (!isShowNotification) {
      dispatch(getNotificationThunk({}));
    }
    setIsShowNotification((prev) => !prev);
  };
  return (
    <div className="relative z-50">
      <Badge count={count_unread}>
        <Button
          type="text"
          icon={<Bell />}
          size="small"
          onClick={_onToggleNotification}
        />
      </Badge>
      {isShowNotification && (
        <List
          className="absolute right-0 top-[100%] z-50 min-w-[300px] overflow-hidden rounded-lg bg-white shadow-xl"
          dataSource={data}
          renderItem={(item) => {
            const {
              actor: { type },
              message,
              created_at,
              read_at,
              id,
            } = item;
            return (
              <List.Item className={cn("", !read_at && "bg-slate-300/20")}>
                <Button
                  className="relative flex h-full w-full flex-col items-start justify-start gap-1 p-2"
                  type="text"
                  onClick={() => !read_at && _onReadNotification(id)}
                >
                  <h3 className="font-semibold">From: {type}</h3>
                  <p>{message}</p>
                  <p className="text-xs text-gray-500">
                    <span>Created at: </span>
                    {new Date(created_at).toLocaleDateString()}
                  </p>
                  <div className="absolute right-0 top-0 z-50 flex items-center justify-center">
                    {read_at && (
                      <Button
                        className="text-red-500"
                        type="text"
                        onClick={() => _onDeleteNotification(id)}
                      >
                        <Trash size={16} />
                      </Button>
                    )}
                    {!read_at && (
                      <Dot className="animate-pulse text-green-500" size={32} />
                    )}
                  </div>
                </Button>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

export default Notification;
