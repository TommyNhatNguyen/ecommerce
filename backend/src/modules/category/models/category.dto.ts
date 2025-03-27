import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { BaseOrder, BaseSortBy, ModelStatus } from 'src/share/models/base-model';

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
  status: z.nativeEnum(ModelStatus).optional(),
});

export const CategoryConditionDTOSchema = z.object({
  name: z.string().optional(),
  id: z.string().uuid().optional(),
  include_products: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_image: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_all: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  order: z.string().optional().default(BaseOrder.DESC),
  sortBy: z.string().optional().default(BaseSortBy.CREATED_AT),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const CategoryBulkDeleteDTOSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type CategoryCreateDTOSchema = z.infer<typeof CategoryCreateDTOSchema>;
export type CategoryUpdateDTOSchema = z.infer<typeof CategoryUpdateDTOSchema>;
export type CategoryConditionDTOSchema = z.infer<
  typeof CategoryConditionDTOSchema
>;
export type CategoryBulkDeleteDTOSchema = z.infer<
  typeof CategoryBulkDeleteDTOSchema
>;
