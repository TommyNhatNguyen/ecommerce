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
  includeInventory?: boolean;
  limit?: number;
  page?: number;
}

export interface OrderCreateDTO {
  description?: string;
  order_state: OrderState;
  order_detail_info: {
    subtotal?: number;
    total_shipping_fee: number;
    total_payment_fee: number;
    total_costs?: number;
    total_discount?: number;
    total_order_discount?: number;
    total_product_discount?: number;
    total?: number;
    shipping_method_id: string;
    payment_id?: string;
    payment_info: {
      payment_method_id: string;
      paid_amount: number;
    };
    customer_id?: string;
    customer_firstName?: string;
    customer_lastName: string;
    customer_phone: string;
    customer_email?: string;
    customer_address: string;
    costs_detail?: string[];
    products_detail: {
      id: string;
      quantity: number;
      warehouse_id?: string;
    }[];
    order_discounts?: string[];
  };
}

export interface OrderUpdateDTO {
  order_state: OrderState;
  description?: string;
  order_detail_info?: {
    subtotal?: number;
    total_shipping_fee?: number;
    total_payment_fee?: number;
    total_costs?: number;
    total_discount?: number;
    total_order_discount?: number;
    total_product_discount?: number;
    total?: number;
    shipping_method_id?: string;
    payment_id?: string;
    payment_info?: {
      payment_method_id?: string;
      paid_amount?: number;
    };
    customer_id?: string;
    customer_firstName?: string;
    customer_lastName?: string;
    customer_phone?: string;
    customer_email?: string;
    customer_address?: string;
    costs_detail?: string[];
    products_detail?: {
      id: string;
      quantity?: number;
      warehouse_id?: string;
    }[];
    order_discounts?: string[];
  };
}
