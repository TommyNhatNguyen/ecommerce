import {
  BaseSortBy,
  ModelStatus,
  BaseOrder,
} from 'src/share/models/base-model';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { StockStatus } from '@models/inventory/inventory.model';

export const ProductCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  name: z.string(),
  price: z.number().nonnegative().min(0),
  variantIds: z.array(z.string().uuid()).optional(),
  quantity: z.number().nonnegative().min(0).optional(),
  low_stock_threshold: z.number().nonnegative().min(0).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  cost: z.number().nonnegative().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  discountIds: z.array(z.string().uuid()).optional(),
  imageIds: z.array(z.string().uuid()).optional(),
});

export const ProductCategoryCreateDTOSchema = z.object({
  product_id: z.string().uuid(),
  category_id: z.string().uuid(),
});

export const ProductDiscountCreateDTOSchema = z.object({
  product_id: z.string().uuid(),
  discount_id: z.string().uuid(),
  discount_amount: z.number().nonnegative().min(0).optional(),
  price_before_discount: z.number().nonnegative().min(0).optional(),
  price_after_discount: z.number().nonnegative().min(0).optional(),
});

export const ProductImageCreateDTOSchema = z.object({
  product_id: z.string().uuid(),
  image_id: z.string().uuid(),
});

export const ProductUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  discountIds: z.array(z.string().uuid()).optional(),
  variantIds: z.array(z.string().uuid()).optional(),
  imageIds: z.array(z.string().uuid()).optional(),
  quantity: z.number().nonnegative().min(0).optional(),
  low_stock_threshold: z.number().nonnegative().min(0).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  cost: z.number().nonnegative().min(0).optional(),
});

export enum ProductStatsSortBy {
  PRODUCT_PRICE = 'price',
  INVENTORY_QUANTITY = 'inventory_quantity',
  DISCOUNT_PERCENTAGE = 'discount_percentage',
  INVENTORY_VALUE = 'inventory_value',
  ASC = 'ASC',
  DESC = 'DESC',
}

export const ProductConditionDTOSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  minPrice: z.union([z.number().nonnegative().min(0), z.string()]).optional(),
  maxPrice: z.union([z.number().nonnegative().min(0), z.string()]).optional(),
  name: z.string().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  sortBy: z.nativeEnum(ProductStatsSortBy).optional(),
  fromCreatedAt: z.string().date().optional(),
  toCreatedAt: z.string().date().optional(),
  includeDiscount: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeCategory: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeVariant: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeImage: z
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
export type ProductDiscountCreateDTO = z.infer<
  typeof ProductDiscountCreateDTOSchema
>;
export type ProductImageCreateDTO = z.infer<
  typeof ProductImageCreateDTOSchema
>;
