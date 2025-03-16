import { brandService } from "@/app/shared/services/brands/brandService";

import { BrandCreateDTO } from "@/app/shared/interfaces/brands/brands.dto";
import { useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useIntl } from "react-intl";

export const useBrand = () => {
  const [loadingCreateBrand, setLoadingCreateBrand] = useState(false);
  const {notificationApi} = useNotification()
  const intl = useIntl()
  const handleCreateBrand = async (data: BrandCreateDTO, callback?: () => void) => {
    try {
      setLoadingCreateBrand(true);
      const response = await brandService.createBrand(data);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "add_brand_success" }),
        });
      } else {
        notificationApi.error({
          message: intl.formatMessage({ id: "add_brand_error" }),
        });
      }
      return response;
    } catch (error) {
      notificationApi.error({
        message: intl.formatMessage({ id: "add_brand_error" }),
      });
    } finally {
      setLoadingCreateBrand(false);
      callback?.();
    }
  };

  return {
    handleCreateBrand,
    loadingCreateBrand,
  };
};
