import { brandService } from "@/app/shared/services/brands/brandService";

import {
  BrandCreateDTO,
  BrandUpdateDTO,
} from "@/app/shared/interfaces/brands/brands.dto";
import { useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useIntl } from "react-intl";

export const useBrand = () => {
  const [loadingCreateBrand, setLoadingCreateBrand] = useState(false);
  const [loadingUpdateBrand, setLoadingUpdateBrand] = useState(false);
  const [loadingDeleteBrand, setLoadingDeleteBrand] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const { notificationApi } = useNotification();
  const intl = useIntl();
  const handleCreateBrand = async (
    data: BrandCreateDTO,
    callback?: () => void,
  ) => {
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

  const handleUpdateBrand = async (
    id: string,
    data: BrandUpdateDTO,
    callback?: () => void,
  ) => {
    try {
      setLoadingUpdateBrand(true);
      const response = await brandService.updateBrand(id, data);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "update_brand_success" }),
        });
      } else {
        notificationApi.error({
          message: intl.formatMessage({ id: "update_brand_error" }),
        });
      }
      return response;
    } catch (error) {
      notificationApi.error({
        message: intl.formatMessage({ id: "update_brand_error" }),
      });
    } finally {
      setLoadingUpdateBrand(false);
      callback?.();
    }
  };

  const handleDeleteBrand = async (ids: string[], callback?: () => void) => {
    try {
      setLoadingDeleteBrand(true);
      const response = await brandService.deleteBulkBrand(ids);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "delete_brand_success" }),
        });
      } else {
        notificationApi.error({
          message: intl.formatMessage({ id: "delete_brand_error" }),
        });
      }
      return response;
    } catch (error) {
      notificationApi.error({
        message: intl.formatMessage({ id: "delete_brand_error" }),
      });
    } finally {
      setLoadingDeleteBrand(false);
      setSelectedBrand([]);
      callback?.();
    }
  };
  const handleSelectBrand = (
    selectedRowKeys: string[],
    selectedRows: any[],
  ) => {
    setSelectedBrand(selectedRowKeys);
  };
  return {
    handleCreateBrand,
    loadingCreateBrand,
    handleUpdateBrand,
    loadingUpdateBrand,
    handleDeleteBrand,
    loadingDeleteBrand,
    handleSelectBrand,
    selectedBrand,
  };
};
