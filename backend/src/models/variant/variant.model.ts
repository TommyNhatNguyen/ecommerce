import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const VariantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(ModelStatus),
})

export type Variant = z.infer<typeof VariantSchema>;