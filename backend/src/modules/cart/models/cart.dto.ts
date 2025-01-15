
import { CartSchema } from 'src/modules/cart/models/cart.model';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const CartCreateDTOSchema = z.object({
  product_quantity: z.number().default(0),
  product_count: z.number().default(0),
  subtotal: z.number().default(0),
  total_discount: z.number().default(0),
  total: z.number().default(0),
});

export const CartUpdateDTOSchema = CartSchema.omit({
  id: true,
}).partial();

export const CartConditionDTOSchema = CartSchema.omit({
  id: true,
}).partial();

export type CartCreateDTO = z.infer<typeof CartCreateDTOSchema>;
export type CartUpdateDTO = z.infer<typeof CartUpdateDTOSchema>;
export type CartConditionDTO = z.infer<typeof CartConditionDTOSchema>;

