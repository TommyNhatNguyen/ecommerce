import { ModelStatus } from "../others/status.model";
import { ProductModel } from "../products/products.model";

export type CartModel = {
  id: string;
  product_quantity: number;
  product_count: number;
  subtotal: number;
  total_discount: number;
  total: number;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  product?: ProductModel[];
};
