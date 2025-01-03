import { categoriesService } from "@/app/shared/services/categories/categoriesService";

import { CreateCategoryDTO, GetCategoriesBodyDTO } from "@/app/shared/interfaces/categories/category.dto";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNotification } from "@/app/contexts/NotificationContext";

export const useCategory = () => {
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
          message: "Create category success",
          description: "Category created successfully",
        });
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Create category failed",
        description: "Please try again",
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
          message: "Delete category success",
          description: "Category deleted successfully",
        });
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Delete category failed",
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
    hanldeCreateCategory,
    hanldeDeleteCategory,
    loadingDelete,
    errorDelete,
  };
};
