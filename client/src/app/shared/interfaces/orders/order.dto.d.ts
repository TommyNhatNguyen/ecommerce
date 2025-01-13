import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface OrderConditionDTO {
  shipping_phone?: string;
  shipping_email?: string;
  shipping_address?: string;
  order_state?: OrderState;
  total_price?: number;
  min_total_price?: number;
  max_total_price?: number;
  customer_id?: string;
  customer_name?: string;
  has_paid?: boolean;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  limit?: number;
  page?: number;
}