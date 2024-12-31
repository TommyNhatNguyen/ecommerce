import {
  CreateProductDTO,
  GetProductsBodyDTO,
} from "@/app/shared/interfaces/products/product.dto";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const productService = {
  createProduct: async (data: CreateProductDTO) : Promise<ProductModel> => {
    const response = await axiosInstance.post("/products", data);
    return response.data;
  },
  getProducts: async (
    query: any,
    data: GetProductsBodyDTO,
  ): Promise<ListResponseModel<ProductModel>> => {
    const response = await axiosInstance.get("/products", {
      params: query,
      data: data,
    });
    return response.data;
  },
};
