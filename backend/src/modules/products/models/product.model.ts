import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';
import { CategorySchema } from '@models/category/category.model';
import { categoryModelName } from 'src/infras/repository/category/dto';
import { reviewModelName } from 'src/infras/repository/review/dto';
import { ReviewSchema } from '@models/review/review.model';
import { variantModelName } from 'src/modules/variant/infras/repo/postgres/dto';
import { VariantSchema } from 'src/modules/variant/models/variant.model';
import { imageModelName } from 'src/infras/repository/image/dto';
import { ImageSchema } from '@models/image/image.model';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  [categoryModelName]: z.array(CategorySchema).optional(),
  [reviewModelName]: z.array(ReviewSchema).optional(),
  [variantModelName]: z.array(VariantSchema).optional(),
  [imageModelName]: z.array(ImageSchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
