import { IBlogs } from "@/app/shared/models/blogs/blogs.model";
import { blogsService } from "@/app/shared/services/blogs/blogs.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ColumnsType, TableProps } from "antd/es/table";
import { useState } from "react";
import { Image } from "antd";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { useNotification } from "@/app/contexts/NotificationContext";
export const useBlog = () => {
  const [blogsPage, setBlogsPage] = useState(1);
  const [blogsLimit, setBlogsLimit] = useState(10);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [deleteBlogLoading, setDeleteBlogLoading] = useState(false);
  const { notificationApi } = useNotification();
  const { data, isLoading: isBlogsLoading, refetch } = useQuery({
    queryKey: ["blogs", blogsPage, blogsLimit],
    queryFn: () =>
      blogsService.list({
        page: blogsPage,
        limit: blogsLimit,
      }),
    placeholderData: keepPreviousData,
  });
  const { data: blogsData, meta } = data || {};
  const { limit, total_count, current_page } = meta || {};
  const handleUpdateStatus = async (id: string, status: ModelStatus) => {
    try {
      setUpdateStatusLoading(true);
      const response = await blogsService.update(id, { status });
      if (response) {
        notificationApi.success({
          message: "Update status successfully",
          description: "The status of the blog has been updated successfully",
        });
      }
    } catch (error) {
      console.log(error);
      notificationApi.error({
        message: "Update status failed",
        description: "The status of the blog has been updated failed",
      });
    } finally {
      setUpdateStatusLoading(false);
    }
  };
  const handleSoftDeleteBlog = async (id: string) => {
    try {
      setDeleteBlogLoading(true);
      const response = await blogsService.update(id, {
        status: "DELETED",
      });
      if (response) {
        notificationApi.success({
          message: "Delete blog successfully",
          description: "The blog has been deleted successfully",
        });
      }
    } catch (error) {
      console.log(error);
      notificationApi.error({
        message: "Delete blog failed",
        description: "The blog has been deleted failed",
      });
    } finally {
      setDeleteBlogLoading(false);
      refetch()
    }
  };
  return {
    blogsData,
    isBlogsLoading,
    limit,
    total_count,
    current_page,
    blogsPage,
    blogsLimit,
    updateStatusLoading,
    setBlogsPage,
    setBlogsLimit,
    handleUpdateStatus,
    handleSoftDeleteBlog,
  };
};
