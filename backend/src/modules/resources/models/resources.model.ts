import { ModelStatus } from 'src/share/models/base-model';

import { ResourcesType } from 'src/share/models/base-model';
import z from 'zod';

export const ResourcesModelSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ResourcesType),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export type ResourcesModel = z.infer<typeof ResourcesModelSchema>;
