import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const OrderDetailSchema = z.object({
  id: z.string().uuid(),
  subtotal: z.number(),
  total_shipping_fee: z.number(),
  total_payment_fee: z.number(),
  total_costs: z.number(),
  total_discount: z.number(),
  total: z.number(),
  shipping_id: z.string().uuid(),
  payment_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  customer_name: z.string(),
  customer_phone: z.string(),
  customer_email: z.string(),
  customer_address: z.string(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;