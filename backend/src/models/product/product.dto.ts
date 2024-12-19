import {
  BaseSortBy,
  ModelStatus,
  BaseOrder,
} from 'src/share/models/base-model';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';

export const ProductCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  name: z.string(),
  price: z.number().nonnegative().min(0),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export const ProductUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const ProductConditionDTOSchema = z.object({
  status: z.nativeEnum(ModelStatus).optional(),
  minPrice: z.union([z.number().nonnegative().min(0), z.string()]).optional(),
  maxPrice: z.union([z.number().nonnegative().min(0), z.string()]).optional(),
  name: z.string().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
});

export type ProductCreateDTOSchema = z.infer<typeof ProductCreateDTOSchema>;
export type ProductUpdateDTOSchema = z.infer<typeof ProductUpdateDTOSchema>;
export type ProductConditionDTOSchema = z.infer<
  typeof ProductConditionDTOSchema
>;
