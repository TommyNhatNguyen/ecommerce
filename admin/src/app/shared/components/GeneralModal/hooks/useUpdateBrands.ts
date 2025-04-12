import { useNotification } from "@/app/contexts/NotificationContext";
import { BrandUpdateDTO } from "@/app/shared/interfaces/brands/brands.dto";
import { brandService } from "@/app/shared/services/brands/brandService";
import { useIntl } from "react-intl";
import { useState } from "react";

export function useUpdateBrands() {
  const { notificationApi } = useNotification();
  const intl = useIntl();
  const [updateBrandLoading, setUpdateBrandLoading] = useState(false);
  const [updateBrandError, setUpdateBrandError] = useState<any>(null);

  const handleUpdateBrand = async (id: string, payload: BrandUpdateDTO) => {
    try {
      setUpdateBrandLoading(true);
      const response = await brandService.updateBrand(id, payload);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "update_brand_success" }),
          description: intl.formatMessage({
            id: "update_brand_success_description",
          }),
        });
        return response;
      } else {
        notificationApi.error({
          message: intl.formatMessage({ id: "update_brand_error" }),
          description: intl.formatMessage({
            id: "update_brand_error_description",
          }),
        });
        throw new Error("Failed to update brand");
      }
    } catch (error) {
      notificationApi.error({
        message: intl.formatMessage({ id: "update_brand_error" }),
        description: intl.formatMessage({
          id: "update_brand_error_description",
        }),
      });
      setUpdateBrandError(error as any);
    } finally {
      setUpdateBrandLoading(false);
    }
  };

  return {
    handleUpdateBrand,
    updateBrandLoading,
    updateBrandError,
  };
}
