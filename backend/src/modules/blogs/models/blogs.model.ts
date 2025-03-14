import { z } from 'zod';
import { ModelStatus } from 'src/share/models/base-model';
import { imageModelName } from 'src/modules/image/infras/repo/dto';
import { userModelName } from 'src/modules/user/infras/repo/dto';
import { UserSchema } from 'src/modules/user/models/user.model';
import { ImageSchema } from 'src/modules/image/models/image.model';

export const BlogsSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  thumnail_url: z.string(),
  [imageModelName]: ImageSchema.optional(),
  [userModelName]: UserSchema.optional(),
});

export type Blogs = z.infer<typeof BlogsSchema>;
