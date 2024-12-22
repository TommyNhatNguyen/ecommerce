import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const ReviewCreateDTO = z.object({
  customer_id: z.string().uuid(),
  rating: z.number().min(0).max(5).default(0),
  comment: z.string().optional(),
  product_id: z.string().uuid(),
});

export const ReviewUpdateDTO = z.object({
  rating: z.number().min(0).max(5).default(0).optional(),
  comment: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  product_id: z.string().uuid().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const ReviewConditionDTO = z.object({
  rating: z.number().min(0).max(5).optional(),
  comment: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  product_id: z.string().uuid().optional(),
});

export type ReviewCreateDTO = z.infer<typeof ReviewCreateDTO>;
export type ReviewUpdateDTO = z.infer<typeof ReviewUpdateDTO>;
export type ReviewConditionDTO = z.infer<typeof ReviewConditionDTO>;
