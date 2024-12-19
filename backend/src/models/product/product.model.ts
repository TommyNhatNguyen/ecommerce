import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';
import { CategorySchema } from '@models/category/category.model';
import { categoryModelName } from 'src/infras/repository/category/dto';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().nonnegative().min(0),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  [categoryModelName]: z.array(CategorySchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
