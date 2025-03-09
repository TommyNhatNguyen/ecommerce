import { ModelStatus } from "src/share/models/base-model";
import { z } from "zod";

export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  product_id: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Brand = z.infer<typeof BrandSchema>;