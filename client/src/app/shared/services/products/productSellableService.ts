import { ProductSellableCondition } from "@/app/shared/interfaces/products/product-sellable.dto";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import { ProductSellableModel } from "@/app/shared/models/products/products-sellable.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const productSellableService = {
  getProductSellable: async (
    condition?: ProductSellableCondition,
  ): Promise<ListResponseModel<ProductSellableModel>> => {
    const response = await axiosInstance.get("/products-sellable", {
      params: condition,
    });
    return response.data;
  },
};
