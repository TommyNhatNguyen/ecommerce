import { RoleWithPermissionsSchema } from 'src/modules/role/models/role.model';
import { ModelStatus, ResourcesType } from 'src/share/models/base-model';
import z from 'zod';


export const PermissionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ResourcesType),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  permission_role: z.array(RoleWithPermissionsSchema).optional(),
});


export type Permission = z.infer<typeof PermissionSchema>;
