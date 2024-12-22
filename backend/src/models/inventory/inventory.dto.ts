import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';
import { v7 as uuidv7 } from 'uuid';
export const InventoryCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  quantity: z.number().min(0),
  product_id: z.string().uuid(),
});

export const InventoryUpdateDTOSchema = z.object({
  quantity: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const InventoryConditionDTOSchema = z.object({
  quantity: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type InventoryCreateDTO = z.infer<typeof InventoryCreateDTOSchema>;
export type InventoryUpdateDTO = z.infer<typeof InventoryUpdateDTOSchema>;
export type InventoryConditionDTO = z.infer<typeof InventoryConditionDTOSchema>;
