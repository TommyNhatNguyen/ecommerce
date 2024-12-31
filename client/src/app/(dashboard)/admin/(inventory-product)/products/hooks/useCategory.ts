import { categoriesService } from "@/app/shared/services/categories/categoriesService";

import { CreateCategoryDTO, GetCategoriesBodyDTO } from "@/app/shared/interfaces/categories/category.dto";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNotification } from "@/app/contexts/NotificationContext";

export const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
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
  return { loading, error, hanldeCreateCategory };
};
