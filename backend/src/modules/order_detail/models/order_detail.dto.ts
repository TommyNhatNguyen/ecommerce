import { OrderDetailSchema } from 'src/modules/order_detail/models/order_detail.model';
import z from 'zod';

export const OrderDetailCreateDTOSchema = z.object({
  subtotal: z.number(),
  total_shipping_fee: z.number(),
  total_payment_fee: z.number(),
  total_costs: z.number(),
  total: z.number(),
  shipping_id: z.string().uuid(),
  payment_id: z.string().uuid(),
  customer_id: z.string().uuid().optional(),
  customer_name: z.string(),
  customer_phone: z.string(),
  customer_email: z.string().optional(),
  customer_address: z.string(),
});

export const OrderDetailUpdateDTOSchema = OrderDetailSchema.omit({
  id: true,
}).partial();

export const OrderDetailConditionDTOSchema = OrderDetailSchema.omit({
  id: true,
}).partial();

export type OrderDetailCreateDTO = z.infer<typeof OrderDetailCreateDTOSchema>;
export type OrderDetailUpdateDTO = z.infer<typeof OrderDetailUpdateDTOSchema>;
export type OrderDetailConditionDTO = z.infer<
  typeof OrderDetailConditionDTOSchema
>;
