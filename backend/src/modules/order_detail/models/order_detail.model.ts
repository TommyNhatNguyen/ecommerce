import { costModelName } from "src/modules/cost/infras/repo/postgres/cost.dto";
import { CostSchema } from "src/modules/cost/models/cost.model";
import { discountModelName } from "src/modules/discount/infras/repo/postgres/discount.dto";
import { DiscountSchema } from "src/modules/discount/models/discount.model";
import { paymentModelName } from "src/modules/payment/infras/repo/postgres/payment.dto";
import { PaymentSchema } from "src/modules/payment/models/payment.model";
import { productSellableModelName } from "src/modules/product_sellable/infras/repo/postgres/dto";
import { ProductSellableSchema } from "src/modules/product_sellable/models/product-sellable.model";
import { shippingModelName } from "src/modules/shipping/infras/postgres/repo/shipping.dto";
import { ShippingSchema } from "src/modules/shipping/models/shipping.model";
import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const OrderDetailSchema = z.object({
  id: z.string().uuid(),
  subtotal: z.number(),
  total_shipping_fee: z.number(),
  total_payment_fee: z.number(),
  total_costs: z.number(),
  total_order_discount: z.number(),
  total_product_discount: z.number(),
  total_discount: z.number(),
  total: z.number(),
  shipping_id: z.string().uuid(),
  payment_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  customer_firstName: z.string(),
  customer_lastName: z.string(),
  customer_phone: z.string(),
  customer_email: z.string(),
  customer_address: z.string(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  [costModelName]: CostSchema.optional(),
  [discountModelName]: DiscountSchema.optional(),
  [shippingModelName]: ShippingSchema.optional(),
  [paymentModelName]: PaymentSchema.optional(),
  [productSellableModelName]: ProductSellableSchema.optional(),
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;
