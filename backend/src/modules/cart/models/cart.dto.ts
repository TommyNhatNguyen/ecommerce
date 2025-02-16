import { CartSchema } from 'src/modules/cart/models/cart.model';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const CartCreateDTOSchema = z.object({
  product_quantity: z.number().default(0),
  product_count: z.number().default(0),
  subtotal: z.number().default(0),
  total_discount: z.number().default(0),
  total: z.number().default(0),
});

export const CartUpdateDTOSchema = CartSchema.omit({
  id: true,
}).partial();

export const CartAddProductSellableDTOSchema = z.object({
  cart_id: z.string(),
  product_sellable_id: z.string(),
  quantity: z.number().default(0),
  subtotal: z.number().default(0),
  discount_amount: z.number().default(0),
  total: z.number().default(0),
});

export const CartAddNewProductsDTOSchema = z.object({
  cart_id: z.string(),
  id: z.string(),
  quantity: z.number().min(1).default(0),
});

export const CartUpdateProductDTOSchema = z.object({
  cart_id: z.string(),
  id: z.string(),
  quantity: z.number().min(1).default(0),
});

export const CartUpdateProductSellableDTOSchema = z.object({
  cart_id: z.string(),
  product_sellable_id: z.string(),
  quantity: z.number().min(1).default(0),
  subtotal: z.number().default(0),
  discount_amount: z.number().default(0),
  total: z.number().default(0),
});

export const CartConditionDTOSchema = z.object({
  include_products: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  product_quantity: z.number().default(0).optional(),
  product_count: z.number().default(0).optional(),
  subtotal: z.number().default(0).optional(),
  total_discount: z.number().default(0).optional(),
  total: z.number().default(0).optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type CartCreateDTO = z.infer<typeof CartCreateDTOSchema>;
export type CartUpdateDTO = z.infer<typeof CartUpdateDTOSchema>;
export type CartConditionDTO = z.infer<typeof CartConditionDTOSchema>;
export type CartAddProductsSellableDTO = z.infer<
  typeof CartAddProductSellableDTOSchema
>;
export type CartAddNewProductsDTO = z.infer<typeof CartAddNewProductsDTOSchema>;
export type CartUpdateProductSellableDTO = z.infer<
  typeof CartUpdateProductSellableDTOSchema
>;
export type CartUpdateProductDTO = z.infer<typeof CartUpdateProductDTOSchema>;
