import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { BaseOrder, BaseSortBy } from 'src/share/models/base-model';

export const CategoryCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  name: z.string(),
  description: z.string().optional(),
  image_id: z.string().uuid().optional(),
});

export const CategoryUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  image_id: z.string().uuid().optional(),
});

export const CategoryConditionDTOSchema = z.object({
  name: z.string().optional(),
  id: z.string().uuid().optional(), 
  include_products: z.boolean().optional(),
  status: z.string().optional(),
  order: z.string().optional().default(BaseOrder.DESC),
  sortBy: z.string().optional().default(BaseSortBy.CREATED_AT),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CategoryCreateDTOSchema = z.infer<typeof CategoryCreateDTOSchema>;
export type CategoryUpdateDTOSchema = z.infer<typeof CategoryUpdateDTOSchema>;
export type CategoryConditionDTOSchema = z.infer<
  typeof CategoryConditionDTOSchema
>;
