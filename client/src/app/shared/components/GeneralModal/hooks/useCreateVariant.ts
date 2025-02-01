import { useNotification } from "@/app/contexts/NotificationContext";
import { VariantCreateDTO } from "@/app/shared/interfaces/variant/variant.interface";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { useState } from "react";

export const useCreateVariant = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isCreateErrror, setIsCreateError] = useState<any>("");
  const { notificationApi } = useNotification();
  const handleCreateVariant = async (
    data: VariantCreateDTO,
    callback?: () => void,
  ) => {
    try {
      setIsCreateLoading(true);
      const response = await variantServices.create(data);
      if (response) {
        return response;
      }
    } catch (error) {
      setIsCreateError(error);
      notificationApi.error({
        message: "Variant created failed",
        description: "Variant created failed",
      });
    } finally {
      setIsCreateLoading(false);
      callback && callback();
    }
  };
  return { handleCreateVariant, isCreateErrror, isCreateLoading };
};
