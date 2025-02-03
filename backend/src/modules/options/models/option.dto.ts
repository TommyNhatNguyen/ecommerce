import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from 'src/share/models/base-model';
import z from 'zod';
export const OptionConditionDTOSchema = z.object({
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.string().optional().default(BaseOrder.DESC),
  sortBy: z.string().optional().default(BaseSortBy.CREATED_AT),
  is_color: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_option_values: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
});

export const OptionCreateDTOSchema = z.object({
  name: z.string(),
  is_color: z.boolean().optional(),
});

export const OptionUpdateDTOSchema = z.object({
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  is_color: z.boolean().optional(),
});

export const OptionValueCreateDTOSchema = z.object({
  name: z.string(),
  value: z.string(),
  option_id: z.string(),
});

export const OptionValueUpdateDTOSchema = z.object({
  name: z.string().optional(),
  value: z.string().optional(),
  option_id: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const OptionValueConditionDTOSchema = z.object({
  name: z.string().optional(),
  value: z.string().optional(),
  option_id: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.string().optional().default(BaseOrder.DESC),
  sortBy: z.string().optional().default(BaseSortBy.CREATED_AT),
});

export type OptionConditionDTO = z.infer<typeof OptionConditionDTOSchema>;
export type OptionCreateDTO = z.infer<typeof OptionCreateDTOSchema>;
export type OptionUpdateDTO = z.infer<typeof OptionUpdateDTOSchema>;
export type OptionValueCreateDTO = z.infer<typeof OptionValueCreateDTOSchema>;
export type OptionValueUpdateDTO = z.infer<typeof OptionValueUpdateDTOSchema>;
export type OptionValueConditionDTO = z.infer<
  typeof OptionValueConditionDTOSchema
>;
