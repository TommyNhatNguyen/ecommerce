import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from 'src/share/models/base-model';
import z from 'zod';
export const VariantConditionDTOSchema = z.object({
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.string().optional().default(BaseOrder.DESC),
  sortBy: z.string().optional().default(BaseSortBy.CREATED_AT),
  option_value_ids: z.array(z.string()).optional(),
  product_id: z.string().uuid().optional(),
  include_options_value: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_option: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_product_sellable: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
});

export const VariantCreateDTOSchema = z.object({
  name: z.string(),
  options_value_ids: z.array(z.string()),
  product_id: z.string().uuid().optional(),
});

export const VariantUpdateDTOSchema = z.object({
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  options_value_ids: z.array(z.string()).optional(),
  product_id: z.string().uuid().optional(),
});

export const VariantOptionValueCreateDTOSchema = z.object({
  variant_id: z.string(),
  option_value_id: z.string(),
});

export type VariantConditionDTO = z.infer<typeof VariantConditionDTOSchema>;
export type VariantCreateDTO = z.infer<typeof VariantCreateDTOSchema>;
export type VariantUpdateDTO = z.infer<typeof VariantUpdateDTOSchema>;
export type VariantOptionValueCreateDTO = z.infer<
  typeof VariantOptionValueCreateDTOSchema
>;
