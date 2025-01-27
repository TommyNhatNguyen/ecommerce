import { ModelStatus, ResourcesType } from 'src/share/models/base-model';
import { PermissionType } from 'src/share/models/base-model';
import z from 'zod';

export const PermissionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ResourcesType),
  status: z.nativeEnum(ModelStatus),
  allow_create: z.boolean().default(true),
  allow_read: z.boolean().default(true),
  allow_update: z.boolean().default(true),
  allow_delete: z.boolean().default(true),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Permission = z.infer<typeof PermissionSchema>;
