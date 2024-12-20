import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';
import { CategorySchema } from '@models/category/category.model';
import { categoryModelName } from 'src/infras/repository/category/dto';
import { discountModelName } from 'src/infras/repository/discount/dto';
import { DiscountSchema } from '@models/discount/discount.model';

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
});

export type Product = z.infer<typeof ProductSchema>;
