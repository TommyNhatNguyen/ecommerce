import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';
import { CategorySchema } from '@models/category/category.model';
import { categoryModelName } from 'src/infras/repository/category/dto';
import { imageModelName } from 'src/infras/repository/image/dto';
import { ImageSchema } from '@models/image/image.model';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventorySchema } from 'src/modules/inventory/models/inventory.model';
import { reviewModelName } from 'src/infras/repository/review/dto';
import { ReviewSchema } from '@models/review/review.model';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountSchema } from 'src/modules/discount/models/discount.model';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().nonnegative().min(0),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  [categoryModelName]: z.array(CategorySchema).optional(),
  [discountModelName]: z.array(DiscountSchema).optional(),
  [imageModelName]: z.array(ImageSchema).optional(),
  [inventoryModelName]: z.object({ ...InventorySchema.shape }).optional(),
  [reviewModelName]: z.array(ReviewSchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
