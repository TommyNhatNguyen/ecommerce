import { useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { discountsService } from "@/app/shared/services/discounts/discountsService";

export function useDiscounts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const { notificationApi } = useNotification();
  const hanldeCreateDiscount = async (data: CreateDiscountDTO) => {
    setLoading(true);
    try {
      const response = await discountsService.createDiscount(data);
      if (response) {
        notificationApi.success({
          message: "Create discount success",
          description: "Discount created successfully",
        });
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Create discount failed",
        description: "Please try again",
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const hanldeDeleteDiscount = async (id: string) => {
    setLoadingDelete(true);
    try {
      const response = await discountsService.deleteDiscount(id);
      if (response) {
        notificationApi.success({
          message: "Delete discount success",
          description: "Discount deleted successfully",
        });
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Delete discount failed",
        description: "Please try again",
      });
      setErrorDelete(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };
  return {
    loading,
    error,
    hanldeCreateDiscount,
    hanldeDeleteDiscount,
    loadingDelete,
    errorDelete,
  };
}
