import { ImageSchema } from '@models/image/image.model';
import { ReviewSchema } from '@models/review/review.model';
import { imageModelName } from 'src/infras/repository/image/dto';
import { reviewModelName } from 'src/infras/repository/review/dto';
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
      quantity: z.number().min(0),
      cost: z.number().min(0),
      total_value: z.number().min(0),
      status: z.nativeEnum(ModelStatus),
      created_at: z.date(),
      updated_at: z.date(),
      stock_status: z.nativeEnum(StockStatus),
      low_stock_threshold: z.number().min(0),
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
});

export type ProductSellable = z.infer<typeof ProductSellableSchema>;
