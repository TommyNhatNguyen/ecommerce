import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';
import { imageModelName } from 'src/modules/image/infras/repo/dto';
import { ImageSchema } from 'src/modules/image/models/image.model';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  [imageModelName]: ImageSchema.optional(),
});

export type Category = z.infer<typeof CategorySchema>;
