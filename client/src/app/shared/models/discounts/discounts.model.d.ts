import {
  DiscountScope,
  DiscountType,
} from "@/app/shared/interfaces/discounts/discounts.dto";

export type DiscountModel = {
  id: string;
  name: string;
  description: string;
  amount: number;
  is_fixed: boolean;
  is_free: boolean;
  is_require_product_count: boolean;
  has_max_discount_count: boolean;
  max_discount_count: number;
  require_product_count: number;
  require_order_amount: number;
  discount_count: number;
  scope: DiscountScope;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
};
