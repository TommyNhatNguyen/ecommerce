import { ModelStatus } from 'src/share/models/base-model';
import { PermissionType } from 'src/share/models/base-model';
import z from 'zod';

export const PermissionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(PermissionType),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Permission = z.infer<typeof PermissionSchema>;
