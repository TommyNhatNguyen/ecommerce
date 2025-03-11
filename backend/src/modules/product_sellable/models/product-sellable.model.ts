import { imageModelName } from 'src/modules/image/infras/repo/dto';
import { ImageSchema } from 'src/modules/image/models/image.model';
import { cartProductModelName } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { CartProductSellableSchema } from 'src/modules/cart/models/cart.model';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountSchema } from 'src/modules/discount/models/discount.model';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import {
  InventorySchema,
  StockStatus,
} from 'src/modules/inventory/models/inventory.model';
import { variantModelName } from 'src/modules/variant/infras/repo/postgres/dto';
import { VariantSchema } from 'src/modules/variant/models/variant.model';
import { ModelStatus } from 'src/share/models/base-model';
import { z } from 'zod';

export const ProductSellableSchema = z.object({
  id: z.string().uuid(),
  price: z.number().nonnegative().min(0),
  total_discounts: z.number().nonnegative().min(0),
  price_after_discounts: z.number().nonnegative().min(0),
  variant_id: z.string().uuid(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  [discountModelName]: z.array(DiscountSchema).optional(),
  [imageModelName]: z.array(ImageSchema).optional(),
  [inventoryModelName]: z
    .object({
      id: z.string().uuid(),
      total_quantity: z.number().min(0),
      total_cost: z.number().min(0),
      stock_status: z.nativeEnum(StockStatus),
      created_at: z.date(),
      updated_at: z.date(),
      status: z.nativeEnum(ModelStatus),
      low_stock_threshold: z.number().min(0),
      high_stock_threshold: z.number().min(0),
      avg_cost: z.number().min(0),
    })
    .optional(),
  [cartProductModelName]: z
    .object({ ...CartProductSellableSchema.shape })
    .optional(),
  [variantModelName]: z.object({
    id: z.string().uuid(),
    name: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    status: z.nativeEnum(ModelStatus),
  }),
  product_details: z.object({
    quantity: z.number(),
    price: z.number(),
    subtotal: z.number(),
    discount_amount: z.number(),
    total: z.number(),
  }),
});

export type ProductSellable = z.infer<typeof ProductSellableSchema>;
