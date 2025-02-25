import { useNotification } from "@/app/contexts/NotificationContext";
import { OptionUpdateDTO } from "@/app/shared/interfaces/variant/variant.interface";
import { optionService } from "@/app/shared/services/variant/optionService";
import { useState } from "react";

export const useUpdateOptionModal = () => {
  const { notificationApi } = useNotification();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateOptionError, setUpdateOptionError] = useState<string>("");

  const handleUpdateOption = async (
    id: string,
    data: OptionUpdateDTO,
    onSuccess?: () => void,
  ) => {
    console.log("🚀 ~ useUpdateOptionModal ~ data:", data)
    try {
      setIsUpdateLoading(true);
      const response = await optionService.updateOption(id, data);
      if (response) {
        onSuccess?.();
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: error?.message || "Failed to update option",
        description: error?.message || "Failed to update option",
      });
      setUpdateOptionError(error?.message || "Failed to update option");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return { isUpdateLoading, updateOptionError, handleUpdateOption };
};
