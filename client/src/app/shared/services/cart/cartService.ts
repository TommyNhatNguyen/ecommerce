import {
  IAddToCartDTO,
  ICartConditionDTO,
} from "../../interfaces/cart/cart.dto";
import { CartModel } from "../../models/cart/cart.model";
import { axiosInstance } from "../../utils/axiosInstance";

export const cartServices = {
  addToCart: async (id: string, data: IAddToCartDTO[]): Promise<CartModel> => {
    return await axiosInstance.post(`/cart/${id}/add`, data);
  },
  getCartById: async (
    id: string,
    condition?: ICartConditionDTO,
  ): Promise<CartModel> => {
    const response = await axiosInstance.get(`/cart/${id}`, {
      params: condition,
    });
    return response.data;
  },
};
