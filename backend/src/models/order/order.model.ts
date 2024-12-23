import { ModelStatus, OrderState } from 'src/share/models/base-model';
import z from 'zod';

export const OrderSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  shipping_phone: z.string().min(5).max(15),
  shipping_email: z.string().email().nullable().optional(),
  shipping_address: z.string(),
  order_state: z.nativeEnum(OrderState).default(OrderState.PENDING),
  total_price: z.number().min(0),
  shipping_method_id: z.string().uuid(),
  payment_method_id: z.string().uuid(),
  has_paid: z.boolean(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Order = z.infer<typeof OrderSchema>;
