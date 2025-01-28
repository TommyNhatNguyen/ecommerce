import { PermissionSchema } from "src/modules/permission/models/permission.model";
import { ModelStatus, Roles } from "src/share/models/base-model";
import z from "zod";

export const RoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  permission: z.array(PermissionSchema).optional(),
})

export const RoleWithPermissionsSchema = z.object({
  permission_id: z.string().uuid(),
  role_id: z.string().uuid(),
  allow_create: z.boolean(),
  allow_read: z.boolean(),
  allow_update: z.boolean(),
  allow_delete: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(ModelStatus),
});

export type Role = z.infer<typeof RoleSchema>;
export type RoleWithPermissions = z.infer<typeof RoleWithPermissionsSchema>;
