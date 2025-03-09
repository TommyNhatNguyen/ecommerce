import {
  BaseSortBy,
  ModelStatus,
  BaseOrder,
} from 'src/share/models/base-model';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { VariantCreateDTOSchema } from 'src/modules/variant/models/variant.dto';
import { ProductSellableCreateDTOSchema } from 'src/modules/product_sellable/models/product-sellable.dto';

export const ProductCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  name: z.string(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z.string(),
  status: z.nativeEnum(ModelStatus).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  variants: z
    .array(
      z.object({
        variant_data: VariantCreateDTOSchema,
        product_sellables: ProductSellableCreateDTOSchema,
      })
    )
    .optional(),
});

export const ProductCategoryCreateDTOSchema = z.object({
  product_id: z.string().uuid(),
  category_id: z.string().uuid(),
});

export const ProductUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  updated_at: z.date().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export enum ProductStatsSortBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const ProductConditionDTOSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  name: z.string().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  sku: z.string().optional(),
  priceRange: z
    .object({
      from: z.union([z.string(), z.number()]).optional(),
      to: z.union([z.string(), z.number()]).optional(),
    })
    .optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
  fromCreatedAt: z.string().date().optional(),
  toCreatedAt: z.string().date().optional(),
  includeVariant: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeVariantInfo: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeVariantInventory: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeVariantOption: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeVariantOptionType: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeCategory: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeImage: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeVariantImage: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeDiscount: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeReview: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
});

export enum ProductStatsType {
  CATEGORY = 'category',
  DISCOUNT = 'discount',
  STATUS = 'status',
  STOCK_STATUS = 'stock_status',
}

export const ProductGetStatsDTOSchema = z.object({
  groupBy: z.nativeEnum(ProductStatsType).optional(),
});

export type ProductCreateDTOSchema = z.infer<typeof ProductCreateDTOSchema>;
export type ProductUpdateDTOSchema = z.infer<typeof ProductUpdateDTOSchema>;
export type ProductConditionDTOSchema = z.infer<
  typeof ProductConditionDTOSchema
>;
export type ProductGetStatsDTO = z.infer<typeof ProductGetStatsDTOSchema>;
export type ProductCategoryCreateDTO = z.infer<
  typeof ProductCategoryCreateDTOSchema
>;
