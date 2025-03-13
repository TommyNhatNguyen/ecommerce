import {
  CreateProductDTO,
  CreateProductDTOV2,
  ProductConditionDTO,
  ProductGetStatsCondition,
  UpdateProductDTO,
} from "@/app/shared/interfaces/products/product.dto";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import {
  ProductModel,
  ProductStatsModel,
} from "@/app/shared/models/products/products.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const productService = {
  createProduct: async (data: CreateProductDTOV2): Promise<ProductModel> => {
    const response = await axiosInstance.post("/products", data);
    return response.data;
  },
  getProducts: async (
    query?: ProductConditionDTO,
  ): Promise<ListResponseModel<ProductModel>> => {
    const response = await axiosInstance.get("/products", {
      params: query,
    });
    return response.data;
  },
  getProductById: async (
    id: string,
    query: ProductConditionDTO,
  ): Promise<ProductModel> => {
    const response = await axiosInstance.get(`/products/${id}`, {
      params: query,
    });
    return response.data;
  },
  deleteProduct: async (id: string): Promise<boolean> => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return !!response.data;
  },
  softDeleteProduct: async (id: string): Promise<ProductModel> => {
    const response = await axiosInstance.put(`/products/${id}`, {
      status: "DELETED",
    });
    return response.data;
  },
  updateProduct: async (
    id: string,
    data: UpdateProductDTO,
  ): Promise<ProductModel> => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },
  getProductStatistics: async (
    query?: ProductGetStatsCondition,
  ): Promise<{ data: ProductStatsModel }> => {
    const response = await axiosInstance.get("/statistics/products", {
      params: query,
    });
    return response.data;
  },
};
