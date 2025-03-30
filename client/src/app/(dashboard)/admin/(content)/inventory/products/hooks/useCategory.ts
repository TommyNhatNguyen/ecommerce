import { categoriesService } from "@/app/shared/services/categories/categoriesService";

import { CreateCategoryDTO, GetCategoriesBodyDTO } from "@/app/shared/interfaces/categories/category.dto";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useIntl } from "react-intl";

export const useCategory = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const { notificationApi } = useNotification();
  const hanldeCreateCategory = async (data: CreateCategoryDTO) => {
    setLoading(true);
    try {
      const response = await categoriesService.createCategory(data);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "create_category_success" }),
          description: intl.formatMessage({ id: "create_category_success" }),
        });
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: intl.formatMessage({ id: "create_category_failed" }),
        description: intl.formatMessage({ id: "create_category_failed" }),
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const hanldeDeleteCategory = async (id: string) => {
    setLoadingDelete(true);
    try {
      const response = await categoriesService.deleteCategory(id);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "delete_category_success" }),
          description: intl.formatMessage({ id: "delete_category_success" }),
        });
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: intl.formatMessage({ id: "delete_category_failed" }),
        description: intl.formatMessage({ id: "delete_category_failed" }),
      });
      setErrorDelete(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };
  return {
    loading,
    error,
    hanldeCreateCategory,
    hanldeDeleteCategory,
    loadingDelete,
    errorDelete,
  };
};
