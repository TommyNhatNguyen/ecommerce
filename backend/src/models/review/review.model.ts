import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  rating: z.number().min(0).max(5).default(0),
  comment: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;
