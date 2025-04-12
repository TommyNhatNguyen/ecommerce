import { useNotification } from "@/app/contexts/NotificationContext";
import { OptionCreateDTO } from "@/app/shared/interfaces/variant/variant.interface";
import { optionService } from "@/app/shared/services/variant/optionService";
import { useState } from "react";

export const useCreateOptionModal = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isCreateErrror, setIsCreateError] = useState<any>("");
  const { notificationApi } = useNotification();
  const handleCreateOption = async (
    data: OptionCreateDTO,
    callback?: () => void,
  ) => {
    try {
      setIsCreateLoading(true);
      const response = await optionService.createOption(data);
      if (response) {
        callback?.();
      }
    } catch (error) {
      setIsCreateError(error);
    } finally {
      setIsCreateLoading(false);
    }
  };
  return { handleCreateOption, isCreateErrror, isCreateLoading };
};
