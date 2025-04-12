import { useNotification } from "@/app/contexts/NotificationContext";
import { UpdateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { useState } from "react";

export const useUpdateDiscountModal = () => {
  const { notificationApi } = useNotification();
  const [updateDiscountLoading, setUpdateDiscountLoading] = useState(false);
  const [updateDiscountError, setUpdateDiscountError] = useState<string>("");
  const handleUpdateDiscount = async (id: string, data: UpdateDiscountDTO) => {
    try {
      setUpdateDiscountLoading(true);
      const response = await discountsService.updateDiscount(id, data);
      if (response) {
        notificationApi.success({
          message: "Discount updated successfully",
          description: "Discount updated successfully",
        });
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: error?.message || "Failed to update discount",
        description: error?.message || "Failed to update discount",
      });
      setUpdateDiscountError(error?.message || "Failed to update discount");
    } finally {
      setUpdateDiscountLoading(false);
    }
  };

  return { updateDiscountLoading, updateDiscountError, handleUpdateDiscount };
};
