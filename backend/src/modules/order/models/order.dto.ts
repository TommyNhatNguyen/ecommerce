import { OrderDetailCreateDTOSchema } from 'src/modules/order_detail/models/order_detail.dto';
import { ModelStatus, OrderState } from 'src/share/models/base-model';
import z from 'zod';

export const OrderCreateDTOSchema = z.object({
  order_detail_id: z.string().uuid(),
  description: z.string().optional(),
  order_state: z.nativeEnum(OrderState).default(OrderState.PENDING).optional(),
  order_detail_info: z.object(OrderDetailCreateDTOSchema.shape),
});

export const OrderUpdateDTOSchema = z.object({
  description: z.string().optional(),
  order_state: z.nativeEnum(OrderState).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const OrderConditionDTOSchema = z.object({
  order_state: z.nativeEnum(OrderState).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type OrderCreateDTO = z.infer<typeof OrderCreateDTOSchema>;
export type OrderUpdateDTO = z.infer<typeof OrderUpdateDTOSchema>;
export type OrderConditionDTO = z.infer<typeof OrderConditionDTOSchema>;
