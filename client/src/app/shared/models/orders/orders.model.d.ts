import { PaymentModel } from "@/app/shared/models/payment/payment.model";
import { CustomerModel } from "../customers/customers.model";
import { ProductModel } from "../products/products.model";
import { ShippingModel } from "@/app/shared/models/shipping/shipping.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { CostModel } from "@/app/shared/models/cost/cost.model";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { ProductSellableModel } from "@/app/shared/models/products/products-sellable.model";

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

export type ProductSellableDetailsInOrderModel = OrderProductSellableHistoryModel;

export type OrderProductSellableHistoryModel = {
  created_at: string;
  discount_amount: number;
  order_detail_id: string;
  price: number;
  product_sellable_id: string;
  product_variant_name: string;
  quantity: number;
  status: string;
  subtotal: number;
  total: number;
  updated_at: string;
  product_sellable: ProductSellableModel;
};

export interface OrderDetailModel {
  id: string;
  subtotal: number;
  total_shipping_fee: number;
  total_payment_fee: number;
  total_costs: number;
  total_discount: number;
  total_order_discount: number;
  total_product_discount: number;
  total: number;
  shipping_method_id: string;
  payment_id: string;
  customer_id: string;
  customer_firstName: string;
  customer_lastName: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  cost?: CostModel[];
  discount?: DiscountModel[];
  shipping?: ShippingModel;
  payment?: PaymentModel;
  page?: number;
  limit?: number;
  order_product_sellable_histories?: OrderProductSellableHistoryModel[];
}
