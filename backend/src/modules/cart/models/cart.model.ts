import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const CartSchema = z.object({
  id: z.string().uuid(),
  product_quantity: z.number().default(0),
  product_count: z.number().default(0),
  subtotal: z.number().default(0),
  total_discount: z.number().default(0),
  total: z.number().default(0),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Cart = z.infer<typeof CartSchema>;