import {
  CreateCategoryDTO,
  GetCategoriesBodyDTO,
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
    query: any,
    data: GetCategoriesBodyDTO,
  ): Promise<ListResponseModel<CategoryModel>> => {
    const response = await axiosInstance.get(`/categories`, {
      params: query,
      data: data,
    });
    return response.data;
  },
};