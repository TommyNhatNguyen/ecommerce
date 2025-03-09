import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from 'src/share/models/base-model';
import z from 'zod';

export const BrandCreateDTOSchema = z.object({
  name: z.string(),
  description: z.string(),
  product_id: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE).optional(),
});

export const BrandUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  product_id: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const BrandConditionDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  product_id: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
  order: z.nativeEnum(BaseOrder).optional(),
});

export type BrandCreateDTO = z.infer<typeof BrandCreateDTOSchema>;
export type BrandUpdateDTO = z.infer<typeof BrandUpdateDTOSchema>;
export type BrandConditionDTO = z.infer<typeof BrandConditionDTOSchema>;
