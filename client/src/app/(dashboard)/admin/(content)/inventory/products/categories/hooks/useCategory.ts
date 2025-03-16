import { useNotification } from "@/app/contexts/NotificationContext";
import { CreateCategoryDTO } from "@/app/shared/interfaces/categories/category.dto";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useCategory = () => {
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [errorCreateCategory, setErrorCreateCategory] = useState<string>("");
  const { notificationApi } = useNotification();
  const handleCreateCategory = async (data: CreateCategoryDTO, callback?: () => void) => {
    setLoadingCreateCategory(true);
    try {
      const response = await categoriesService.createCategory(data);
      if (response) {
        notificationApi.success({ message: "Category created successfully" });
      } else {
        notificationApi.error({ message: "Failed to create category" });
      }
    } catch (error: any) {
      setErrorCreateCategory(error.message);
    } finally {
      setLoadingCreateCategory(false);
      callback?.();
    }
  };
  return {
    loadingCreateCategory,
    errorCreateCategory,
    handleCreateCategory,
  };
};