import { PaymentModel } from "@/app/shared/models/payment/payment.model";
import { CustomerModel } from "../customers/customers.model";
import { ProductModel } from "../products/products.model";
import { ShippingModel } from "@/app/shared/models/shipping/shipping.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { CostModel } from "@/app/shared/models/cost/cost.model";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";

export enum OrderState {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  RETURNED = "RETURNED",
  EXPIRED = "EXPIRED",
  CANCELLED_BY_ADMIN = "CANCELLED_BY_ADMIN",
}

interface ProductDetailModel extends ProductModel {
  order_detail: {
    quantity: number;
    subtotal: number;
    status: ModelStatus;
  };
}

export interface OrderModel {
  id: string;
  description: string;
  order_state: OrderState;
  order_detail_id: string;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  order_detail: OrderDetailModel;
}

export interface OrderDetailModel {
  id: string;
  subtotal: number;
  total_shipping_fee: number;
  total_payment_fee: number;
  total_costs: number;
  total_discount: number;
  total: number;
  shipping_method_id: string;
  payment_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  cost?: Pick<CostModel, keyof OrderDetailCostModel>[];
  discount?: DiscountModel[];
  product?: (ProductModel & {
    product_details: {
      quantity: number;
      price: number;
      subtotal: number;
      discount_amount: number;
      total: number;
    };
  })[];
  shipping?: ShippingModel;
  payment?: PaymentModel;
}
export interface OrderDetailCostModel {
  id: string;
  name: string;
  cost: number;
}