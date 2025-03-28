import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';
import { categoryModelName } from 'src/modules/category/infras/repo/dto';
import { reviewModelName } from 'src/modules/review/infras/repo/dto';
import { ReviewSchema } from 'src/modules/review/models/review.model';
import { variantModelName } from 'src/modules/variant/infras/repo/postgres/dto';
import { VariantSchema } from 'src/modules/variant/models/variant.model';
import { imageModelName } from 'src/modules/image/infras/repo/dto';
import { ImageSchema } from 'src/modules/image/models/image.model';
import { CategorySchema } from 'src/modules/category/models/category.model';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z.string(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  [categoryModelName]: z.array(CategorySchema).optional(),
  [reviewModelName]: z.array(ReviewSchema).optional(),
  [variantModelName]: z.array(VariantSchema).optional(),
  [imageModelName]: z.array(ImageSchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
