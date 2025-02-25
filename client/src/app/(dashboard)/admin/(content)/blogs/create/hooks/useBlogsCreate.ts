import { useNotification } from "@/app/contexts/NotificationContext";
import { useAppSelector } from "@/app/shared/hooks/useRedux";
import { IBlogsCreate } from "@/app/shared/interfaces/blogs/blogs.interface";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { ImageResponse } from "@/app/shared/models/images/images.model";
import { blogsService } from "@/app/shared/services/blogs/blogs.service";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import { useState } from "react";

export const useBlogsCreate = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isUploadImageLoading, setIsUploadImageLoading] = useState(false);
  const { notificationApi } = useNotification();
  const handleUploadImage = async (
    file: UploadFile,
  ): Promise<ImageResponse> => {
    try {
      setIsUploadImageLoading(true);
      const response = await imagesService.uploadImage(
        file.originFileObj as RcFile,
        {
          type: "BLOG" as ImageType,
        },
      );
      if (response) {
        return response;
      } else {
        throw new Error("Upload image failed");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsUploadImageLoading(false);
    }
  };
  const handleCreateBlog = async (
    data: IBlogsCreate,
    images: { [key: string]: UploadFile },
    callback?: () => void,
  ) => {
    const payload: IBlogsCreate = {
      ...data,
    };
    payload.thumnail_url = (
      await handleUploadImage(Object.values(images)[0])
    )?.url;
    try {
      setIsCreateLoading(true);
      const response = await blogsService.create(payload);
      if (response) {
        notificationApi.success({
          message: "Create blog successfully",
          description: "Blog created successfully",
        });
        callback?.();
      }
    } catch (error) {
      console.log(error);
      notificationApi.error({
        message: "Create blog failed",
        description: "Blog created failed",
      });
    } finally {
      setIsCreateLoading(false);
    }
  };
  const isCreateBlogLoading = isCreateLoading || isUploadImageLoading;
  return {
    handleCreateBlog,
    handleUploadImage,
    isUploadImageLoading,
    isCreateBlogLoading,
  };
};
