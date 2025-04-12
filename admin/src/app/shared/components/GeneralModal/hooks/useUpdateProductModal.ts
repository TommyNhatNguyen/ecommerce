import { useNotification } from "@/app/contexts/NotificationContext";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { UpdateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { productService } from "@/app/shared/services/products/productService";
import { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

export function useUpdateProductModal() {
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const [deleteImageError, setDeleteImageError] = useState(null);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [uploadImageError, setUploadImageError] = useState(null);
  const [updateProductLoading, setUpdateProductLoading] = useState(false);
  const [updateProductError, setUpdateProductError] = useState(null);
  const { notificationApi } = useNotification();
  const handleDeleteImage = async (imageId: string) => {
    try {
      setDeleteImageLoading(true);
      const response = await imagesService.deleteImage(imageId);
      if (response) {
        notificationApi.success({
          message: "Delete image success",
          description: "Image deleted successfully",
        });
        return response.data;
      }
      return null;
    } catch (error) {
      notificationApi.error({
        message: "Delete image failed",
        description: "Failed to delete image",
      });
      setDeleteImageError(error as any);
      return null;
    } finally {
      setDeleteImageLoading(false);
    }
  };
  const handleUploadImages = async (imageFileList: UploadFile[]) => {
    if (imageFileList.length === 0) return;
    setUploadImageLoading(true);
    try {
      const response = await Promise.all(
        imageFileList.map(async (file) => {
          if (!file?.originFileObj) return;
          const response = await imagesService.uploadImage(file.originFileObj, {
            type: "PRODUCT" as ImageType.PRODUCT,
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
  const handleUpdateProduct = async (id: string, payload: UpdateProductDTO) => {
    setUpdateProductLoading(true);
    try {
      const response = await productService.updateProduct(id, payload);
      if (response) {
        notificationApi.success({
          message: "Update product success",
          description: "Product updated successfully",
        });
        return response;
      }
      return null;
    } catch (error) {
      notificationApi.error({
        message: "Update product failed",
        description: "Failed to update product",
      });
      setUpdateProductError(error as any);
      return null;
    } finally {
      setUpdateProductLoading(false);
    }
  };
  return {
    deleteImageLoading,
    deleteImageError,
    handleDeleteImage,
    uploadImageLoading,
    uploadImageError,
    handleUploadImages,
    updateProductLoading,
    updateProductError,
    handleUpdateProduct,
  };
}
