import { ModelStatus, NumberType } from 'src/share/models/base-model';
import z from 'zod';

export const CostSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(NumberType),
  name: z.string(),
  cost: z.number().min(0).default(0),
  description: z.string().optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Cost = z.infer<typeof CostSchema>;
