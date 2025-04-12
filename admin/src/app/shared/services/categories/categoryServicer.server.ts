"use server";

import { GetCategoriesBodyDTO } from "@/app/shared/interfaces/categories/category.dto";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";

export const getCategories = async (
  query?: GetCategoriesBodyDTO,
): Promise<ListResponseModel<CategoryModel>> => {
  try {
    const categories = await categoriesService.getCategories(query);
    if (!categories) {
      throw new Error("Categories not found");
    }
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
