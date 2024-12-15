import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;
