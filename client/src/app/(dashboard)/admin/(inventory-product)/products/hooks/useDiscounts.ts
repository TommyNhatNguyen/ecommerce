import { useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { discountsService } from "@/app/shared/services/discounts/discountsService";

export function useDiscounts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
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
  return { loading, error, hanldeCreateDiscount };
}
