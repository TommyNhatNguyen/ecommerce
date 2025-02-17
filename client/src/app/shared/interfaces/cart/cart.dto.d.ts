import { ModelStatus } from "../../models/others/status.model";

export type IAddToCartDTO = {
  id: string;
  quantity: number;
  cart_id: string;
};

export type IAddToCartDTOWithLocal = {
  id: string;
  quantity: number;
  cart_id: string;
  img_url: string;
  name: string;
  price: number;
  price_after_discounts: number;
  subtotal: number;
  discount_amount: number;
  total: number;
  product_sellable: ProductSellableModel;
};

export type ICartConditionDTO = {
  include_products?: boolean;
  product_quantity?: number;
  product_count?: number;
  subtotal?: number;
  total_discount?: number;
  total?: number;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
};
