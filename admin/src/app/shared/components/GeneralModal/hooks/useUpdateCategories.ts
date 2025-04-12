import { useNotification } from "@/app/contexts/NotificationContext";
import { UpdateCategoryDTO } from "@/app/shared/interfaces/categories/category.dto";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { UploadFile } from "antd";
import { useState } from "react";
export function useUpdateCategories() {
  const { notificationApi } = useNotification();
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [uploadImageError, setUploadImageError] = useState<any>(null);
  const [updateCategoryLoading, setUpdateCategoryLoading] = useState(false);
  const [updateCategoryError, setUpdateCategoryError] = useState<any>(null);
  const handleUploadImages = async (imageFileList: UploadFile[]) => {
    if (imageFileList.length === 0) return;
    setUploadImageLoading(true);
    try {
      const response = await Promise.all(
        imageFileList.map(async (file) => {
          if (!file?.originFileObj) return;
          const response = await imagesService.uploadImage(file.originFileObj, {
            type: "CATEGORY" as ImageType.CATEGORY,
          });
          if (response) {
            return response;
          } else {
            throw new Error("Failed to upload image");
          }
        }),
      );
      if (response.length > 0) {
        const imageIds = response.map((item) => item?.id);
        return imageIds;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      setUploadImageError(error as any);
      return null;
    } finally {
      setUploadImageLoading(false);
    }
  };
  const handleUpdateCategory = async (id: string, payload: UpdateCategoryDTO) => {
    try {
      setUpdateCategoryLoading(true);
      const response = await categoriesService.updateCategory(id, payload);
      if (response) {
        notificationApi.success({
          message: "Update category success",
          description: "Category updated successfully",
        });
        return response;
      } else {
        notificationApi.error({
          message: "Update category failed",
          description: "Failed to update category",
        });
        throw new Error("Failed to update category");
      }
    } catch (error) {
      notificationApi.error({
        message: "Update category failed",
        description: "Failed to update category",
      });
      setUpdateCategoryError(error as any);
    } finally {
      setUpdateCategoryLoading(false);
    }
  };
  return {
    uploadImageLoading,
    uploadImageError,
    handleUploadImages,
    handleUpdateCategory,
    updateCategoryLoading,
    updateCategoryError,
  };
}
