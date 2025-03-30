import { useNotification } from "@/app/contexts/NotificationContext";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/app/shared/interfaces/categories/category.dto";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";

export const useCategory = () => {
  const intl = useIntl();
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [errorCreateCategory, setErrorCreateCategory] = useState<string>("");
  const [loadingUpdateCategory, setLoadingUpdateCategory] = useState(false);
  const [errorUpdateCategory, setErrorUpdateCategory] = useState<string>("");
  const [loadingDeleteCategory, setLoadingDeleteCategory] = useState(false);
  const [errorDeleteCategory, setErrorDeleteCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<string>("");
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<string>("");
  const { notificationApi } = useNotification();
  const handleCreateCategory = async (
    data: CreateCategoryDTO,
    callback?: () => void,
  ) => {
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
  const handleSelectCategory = (
    selectedRowKeys: string[],
    selectedRows: any[],
  ) => {
    setSelectedCategory(selectedRowKeys);
  };
  const handleUpdateCategory = async (
    id: string,
    data: UpdateCategoryDTO,
    callback?: () => void,
  ) => {
    setLoadingUpdateCategory(true);
    try {
      const response = await categoriesService.updateCategory(id, data);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "change_status_success" }),
          description: intl.formatMessage({ id: "change_status_success" }),
        });
      }
    } catch (error: any) {
      setErrorUpdateCategory(error.message);
      notificationApi.error({
        message: intl.formatMessage({ id: "change_status_error" }),
        description: intl.formatMessage({ id: "change_status_error" }),
      });
    } finally {
      setLoadingUpdateCategory(false);
      callback?.();
    }
  };
  const handleDeleteCategories = async (ids: string[]) => {
    setLoadingDeleteCategory(true);
    try {
      const response = await categoriesService.bulkDeleteCategory(ids);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "delete_categories_success" }),
          description: intl.formatMessage({ id: "delete_categories_success" }),
        });
      } else {
        notificationApi.error({
          message: intl.formatMessage({ id: "delete_categories_error" }),
          description: intl.formatMessage({ id: "delete_categories_error" }),
        });
      }
    } catch (error: any) {
      setErrorDeleteCategory(error.message);
    } finally {
      setLoadingDeleteCategory(false);
      setSelectedCategory([]);
    }
  };
  const handleDeleteCategory = async (id: string, callback?: () => void) => {
    try {
      setLoadingDeleteCategory(true);
      const response = await categoriesService.deleteCategory(id);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "delete_categories_success" }),
          description: intl.formatMessage({ id: "delete_categories_success" }),
        });
      }
    } catch (error: any) {
      setErrorDeleteCategory(error.message);
    } finally {
      setLoadingDeleteCategory(false);
      setSelectedDeleteItem("");
      callback?.();
    }
  };
  const handleSelectUpdateItem = (id: string) => {
    setSelectedUpdateItem(id);
  };
  return {
    loadingCreateCategory,
    errorCreateCategory,
    handleCreateCategory,
    selectedCategory,
    handleSelectCategory,
    loadingUpdateCategory,
    errorUpdateCategory,
    handleUpdateCategory,
    loadingDeleteCategory,
    errorDeleteCategory,
    handleDeleteCategories,
    selectedUpdateItem,
    handleSelectUpdateItem,
    handleDeleteCategory,
  };
};
