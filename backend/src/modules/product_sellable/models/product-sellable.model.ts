import { CategorySchema } from '@models/category/category.model';
import { ImageSchema } from '@models/image/image.model';
import { ReviewSchema } from '@models/review/review.model';
import { categoryModelName } from 'src/infras/repository/category/dto';
import { imageModelName } from 'src/infras/repository/image/dto';
import { reviewModelName } from 'src/infras/repository/review/dto';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountSchema } from 'src/modules/discount/models/discount.model';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventorySchema } from 'src/modules/inventory/models/inventory.model';
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
  [inventoryModelName]: z.object({ ...InventorySchema.shape }).optional(),
});

export type ProductSellable = z.infer<typeof ProductSellableSchema>;
