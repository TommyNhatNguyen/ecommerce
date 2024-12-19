import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;
