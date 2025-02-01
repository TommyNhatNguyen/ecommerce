import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const VariantSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  name: z.string(),
  value: z.string(),
  is_color: z.boolean().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(ModelStatus),
});

export type Variant = z.infer<typeof VariantSchema>;
