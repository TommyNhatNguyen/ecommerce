import { IMAGE_TYPE } from "@/app/constants/imageType";
import { useNotification } from "@/app/contexts/NotificationContext";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { CheckboxChangeEvent, CheckboxProps } from "antd";
import { useState } from "react";

export const useResources = () => {
  const [checkedList, setCheckedList] = useState<ImageType[]>([]);
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const { notificationApi } = useNotification();
  const checkAll = Object.values(IMAGE_TYPE).length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 &&
    checkedList.length < Object.values(IMAGE_TYPE).length;
  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? Object.values(IMAGE_TYPE) : []);
  };
  const handleChangeCheckedList = (e: ImageType[]) => {
    setCheckedList(e);
  };
  const handleDeleteImage = async (id: string, callback?: () => void) => {
    setDeleteImageLoading(true);
    try {
      const res = await imagesService.deleteImage(id);
      if (res) {
        notificationApi.success({
          message: "Delete image successfully",
          description: "The image has been deleted successfully",
        });
      }
    } catch (error) {
      notificationApi.error({
        message: "Delete image failed",
        description: "The image has been deleted failed",
      });
    } finally {
      setDeleteImageLoading(false);
      callback && callback();
    }
  };
  return {
    checkedList,
    checkAll,
    indeterminate,
    handleCheckAllChange,
    handleChangeCheckedList,
    handleDeleteImage,
    deleteImageLoading,
  };
};
