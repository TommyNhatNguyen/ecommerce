import { ProductSellableCreateDTOSchema } from 'src/modules/product_sellable/models/product-sellable.dto';
import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from 'src/share/models/base-model';
import z from 'zod';
export const VariantConditionDTOSchema = z.object({
  ids: z.array(z.string()).optional(),
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.string().default(BaseOrder.DESC).optional(),
  sortBy: z.string().default(BaseSortBy.CREATED_AT).optional(),
  option_value_ids: z.array(z.string()).optional(),
  product_id: z.string().uuid().optional(),
  sku: z.string().optional(),
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
  include_inventory: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_warehouse: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_product: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
});

export const VariantCreateDTOSchema = z.object({
  name: z.string(),
  options_value_ids: z.array(z.string()),
  product_id: z.string().uuid().optional(),
  sku: z.string(),
  product_sellables: ProductSellableCreateDTOSchema,
});

export const VariantUpdateDTOSchema = z.object({
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  options_value_ids: z.array(z.string()).optional(),
  product_id: z.string().uuid().optional(),
  sku: z.string().optional(),
  product_sellables: ProductSellableCreateDTOSchema.optional(),
}); 

export const VariantOptionValueCreateDTOSchema = z.object({
  variant_id: z.string(),
  option_value_id: z.string(),
});

export const VariantBulkDeleteDTOSchema = z.object({
  ids: z.array(z.string()),
});

export type VariantConditionDTO = z.infer<typeof VariantConditionDTOSchema>;
export type VariantCreateDTO = z.infer<typeof VariantCreateDTOSchema>;
export type VariantUpdateDTO = z.infer<typeof VariantUpdateDTOSchema>;
export type VariantOptionValueCreateDTO = z.infer<
  typeof VariantOptionValueCreateDTOSchema
>;
export type VariantBulkDeleteDTO = z.infer<typeof VariantBulkDeleteDTOSchema>;
