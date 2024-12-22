import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const ImageSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Image = z.infer<typeof ImageSchema>;