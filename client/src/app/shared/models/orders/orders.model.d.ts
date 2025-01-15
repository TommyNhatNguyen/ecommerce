import { PaymentModel } from "@/app/shared/models/payment/payment.model";
import { CustomerModel } from "../customers/customers.model";
import { ProductModel } from "../products/products.model";
import { ShippingModel } from "@/app/shared/models/shipping/shipping.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";

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
  customer_id: string;
  customer_name: string;
  shipping_phone: string;
  shipping_email: string;
  shipping_address: string;
  order_state: OrderState;
  description: string;
  total_price: number;
  shipping_method_id: string;
  payment_method_id: string;
  has_paid: boolean;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  customer: CustomerModel;
  shipping: ShippingModel;
  payment: PaymentModel;
  product: ProductDetailModel[];
}
