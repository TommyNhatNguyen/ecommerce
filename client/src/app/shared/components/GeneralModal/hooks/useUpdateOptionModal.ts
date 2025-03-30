import { useNotification } from "@/app/contexts/NotificationContext";
import { OptionUpdateDTO } from "@/app/shared/interfaces/variant/variant.interface";
import { optionService } from "@/app/shared/services/variant/optionService";
import { useIntl } from "react-intl";
import { useState } from "react";

export const useUpdateOptionModal = () => {
  const { notificationApi } = useNotification();
  const intl = useIntl();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateOptionError, setUpdateOptionError] = useState<string>("");

  const handleUpdateOption = async (
    id: string,
    data: OptionUpdateDTO,
    onSuccess?: () => void,
  ) => {
    try {
      setIsUpdateLoading(true);
      const response = await optionService.updateOption(id, data);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "update_option_success" }),
          description: intl.formatMessage({
            id: "update_option_success_description",
          }),
        });
        onSuccess?.();
        return response;
      } else {
        notificationApi.error({
          message: intl.formatMessage({ id: "update_option_error" }),
          description: intl.formatMessage({
            id: "update_option_error_description",
          }),
        });
        throw new Error("Failed to update option");
      }
    } catch (error: any) {
      notificationApi.error({
        message: intl.formatMessage({ id: "update_option_error" }),
        description: intl.formatMessage({
          id: "update_option_error_description",
        }),
      });
      setUpdateOptionError(error?.message || "Failed to update option");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return { isUpdateLoading, updateOptionError, handleUpdateOption };
};
