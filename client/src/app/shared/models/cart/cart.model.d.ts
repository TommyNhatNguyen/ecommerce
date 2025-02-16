import { ModelStatus } from "../others/status.model";
import { ProductSellableModel } from "../products/products-sellable.model";
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
  product_sellable?: ProductSellableModel[];
};

export type CartProductSellableModel = {
  cart_id: string,
  product_sellable_id: string,
  quantity: number,
  subtotal: number,
  discount_amount: number,
  total: number,
  status: ModelStatus,
  created_at: string,
  updated_at: string,
}