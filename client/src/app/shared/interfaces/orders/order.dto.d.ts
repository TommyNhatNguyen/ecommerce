import { OrderState } from "@/app/shared/models/orders/orders.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface OrderConditionDTO {
  order_state?: OrderState;
  description?: string;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  includeOrderDetail?: boolean;
  includeDiscount?: boolean;
  includeCost?: boolean;
  includeProducts?: boolean;
  includeShipping?: boolean;
  includePayment?: boolean;
  limit?: number;
  page?: number;
}
