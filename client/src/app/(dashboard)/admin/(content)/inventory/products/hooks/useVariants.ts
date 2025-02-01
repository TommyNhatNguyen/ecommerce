import { useNotification } from "@/app/contexts/NotificationContext";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { useState } from "react";

export const useVariants = () => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<any>("");
  const { notificationApi } = useNotification();
  const handleDeleteVariant = async (id: string) => {
    setLoadingDelete(true);
    try {
      const response = await variantServices.delete(id);
      if (response) {
        return response;
      }
    } catch (error: any) {
      setErrorDelete(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };
  return {
    handleDeleteVariant,
    loadingDelete,
    errorDelete,
  };
};
