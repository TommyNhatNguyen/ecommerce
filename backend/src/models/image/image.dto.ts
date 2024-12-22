import z from "zod";
import { v7 as uuidv7 } from "uuid";
import { ModelStatus } from "src/share/models/base-model";

export const ImageCreateDTOSchema = z.object({
  id: z.string().uuid().default(() => uuidv7()),
  url: z.string(),
});
export const ImageUpdateDTOSchema = z.object({
  url: z.string().optional(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type ImageCreateDTO = z.infer<typeof ImageCreateDTOSchema>;
export type ImageUpdateDTO = z.infer<typeof ImageUpdateDTOSchema>;