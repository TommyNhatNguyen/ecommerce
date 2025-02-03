import { BaseOrder, ModelStatus } from 'src/share/models/base-model';
import { StockStatus } from 'src/modules/inventory/models/inventory.model';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { ProductStatsSortBy } from 'src/modules/products/models/product.dto';

export const ProductSellableCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  product_id: z.string().uuid(),
  price: z.number().nonnegative().min(0),
  total_discounts: z.number().nonnegative().min(0),
  price_after_discounts: z.number().nonnegative().min(0),
  quantity: z.number().nonnegative().min(0).optional(),
  low_stock_threshold: z.number().nonnegative().min(0).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  cost: z.number().nonnegative().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  discountIds: z.array(z.string().uuid()).optional(),
  imageIds: z.array(z.string().uuid()).optional(),
  variant_id: z.string().uuid(),
});

export const ProductSellableUpdateDTOSchema = z.object({
  price: z.number().nonnegative().min(0).optional(),
  total_discounts: z.number().nonnegative().min(0).optional(),
  price_after_discounts: z.number().nonnegative().min(0).optional(),
  quantity: z.number().nonnegative().min(0).optional(),
  low_stock_threshold: z.number().nonnegative().min(0).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  cost: z.number().nonnegative().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  discountIds: z.array(z.string().uuid()).optional(),
  imageIds: z.array(z.string().uuid()).optional(),
  variantIds: z.array(z.string().uuid()).optional(),
});

export const ProductSellableConditionDTOSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  minPrice: z.union([z.number().nonnegative().min(0), z.string()]).optional(),
  maxPrice: z.union([z.number().nonnegative().min(0), z.string()]).optional(),
  minQuantity: z
    .union([z.number().nonnegative().min(0), z.string()])
    .optional(),
  maxQuantity: z
    .union([z.number().nonnegative().min(0), z.string()])
    .optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  sortBy: z.nativeEnum(ProductStatsSortBy).optional(),
  fromCreatedAt: z.string().date().optional(),
  toCreatedAt: z.string().date().optional(),
  includeProduct: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeDiscount: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeImage: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  includeVariant: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
});

export const ProductSellableDiscountCreateDTOSchema = z.object({
  product_sellable_id: z.string().uuid(),
  discount_id: z.string().uuid(),
});

export const ProductSellableImageCreateDTOSchema = z.object({
  product_sellable_id: z.string().uuid(),
  image_id: z.string().uuid(),
});

export const ProductSellableVariantCreateDTOSchema = z.object({
  product_sellable_id: z.string().uuid(),
  variant_id: z.string().uuid(),
});

export type ProductSellableCreateDTO = z.infer<
  typeof ProductSellableCreateDTOSchema
>;
export type ProductSellableUpdateDTO = z.infer<
  typeof ProductSellableUpdateDTOSchema
>;
export type ProductSellableConditionDTO = z.infer<
  typeof ProductSellableConditionDTOSchema
>;
export type ProductSellableDiscountCreateDTO = z.infer<
  typeof ProductSellableDiscountCreateDTOSchema
>;
export type ProductSellableImageCreateDTO = z.infer<
  typeof ProductSellableImageCreateDTOSchema
>;
export type ProductSellableVariantCreateDTO = z.infer<
  typeof ProductSellableVariantCreateDTOSchema
>;
