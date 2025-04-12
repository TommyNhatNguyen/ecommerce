import {
  CreateCategoryDTO,
  GetCategoriesBodyDTO,
  UpdateCategoryDTO,
} from "@/app/shared/interfaces/categories/category.dto";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const categoriesService = {
  createCategory: async (data: CreateCategoryDTO): Promise<CategoryModel> => {
    const response = await axiosInstance.post("/categories", data);
    return response.data;
  },
  getCategories: async (
    query?: GetCategoriesBodyDTO,
  ): Promise<ListResponseModel<CategoryModel>> => {
    const response = await axiosInstance.get(`/categories`, {
      params: query,
    });
    return response.data;
  },
  getCategoryById: async (
    id: string,
    data?: GetCategoriesBodyDTO,
  ): Promise<CategoryModel> => {
    const response = await axiosInstance.get(`/categories/${id}`, {
      params: data,
    });
    return response.data;
  },
  updateCategory: async (
    id: string,
    data: UpdateCategoryDTO,
  ): Promise<CategoryModel> => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string): Promise<CategoryModel> => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
  bulkDeleteCategory: async (ids: string[]): Promise<boolean> => {
    const response = await axiosInstance.delete(`/categories/delete`, {
      data: { ids },
    });
    return response.data;
  },
};
