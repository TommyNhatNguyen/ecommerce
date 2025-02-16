import { ModelStatus } from "../../models/others/status.model";

export type IAddToCartDTO = {
  id: string;
  quantity: number;
  cart_id: string;
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
