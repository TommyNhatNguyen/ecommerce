import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from "src/share/models/base-model";
import z from "zod";
export const VariantConditionDTOSchema = z.object({
  type: z.string().optional(),
  name: z.string().optional(),
  value: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.string().optional().default(BaseOrder.DESC),
  sortBy: z.string().optional().default(BaseSortBy.CREATED_AT),
  is_color: z.boolean().optional(),
});

export const VariantCreateDTOSchema = z.object({
  type: z.string(),
  name: z.string(),
  value: z.string(),
  is_color: z.boolean().optional(),
});

export const VariantUpdateDTOSchema = z.object({
  type: z.string().optional(),
  name: z.string().optional(),
  value: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  is_color: z.boolean().optional(),
});

export type VariantConditionDTO = z.infer<typeof VariantConditionDTOSchema>;
export type VariantCreateDTO = z.infer<typeof VariantCreateDTOSchema>;
export type VariantUpdateDTO = z.infer<typeof VariantUpdateDTOSchema>;
