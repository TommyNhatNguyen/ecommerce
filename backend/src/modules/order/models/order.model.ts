import { ModelStatus, OrderState } from 'src/share/models/base-model';
import z from 'zod';

export const OrderSchema = z.object({
  id: z.string().uuid(),
  description: z.string().optional(),
  order_state: z.nativeEnum(OrderState).default(OrderState.PENDING),
  order_detail_id: z.string().uuid(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Order = z.infer<typeof OrderSchema>;
