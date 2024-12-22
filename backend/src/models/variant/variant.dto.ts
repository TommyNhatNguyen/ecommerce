import { BaseOrder, BaseSortBy, ModelStatus } from "src/share/models/base-model";
import z from "zod";
import { v7 as uuidv7 } from 'uuid';
export const VariantConditionDTOSchema = z.object({
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.string().optional().default(BaseOrder.DESC),
  sortBy: z.string().optional().default(BaseSortBy.CREATED_AT),
})

export const VariantCreateDTOSchema = z.object({
  id: z.string().uuid().default(() => uuidv7()),
  name: z.string(),
})

export const VariantUpdateDTOSchema = z.object({
  name: z.string(),
  status: z.nativeEnum(ModelStatus),
})

export type VariantConditionDTO = z.infer<typeof VariantConditionDTOSchema>;
export type VariantCreateDTO = z.infer<typeof VariantCreateDTOSchema>;
export type VariantUpdateDTO = z.infer<typeof VariantUpdateDTOSchema>;
