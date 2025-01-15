import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const ShippingSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  cost: z.number().min(0),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Shipping = z.infer<typeof ShippingSchema>;

