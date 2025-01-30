import { BaseOrder, BaseSortBy, ModelStatus, Roles } from 'src/share/models/base-model';
import z from 'zod';

export const IRolePermissionCreateDTOSchema = z.object({
  permission_id: z.string().uuid(),
  role_id: z.string().uuid().optional(),
  allow_read: z.string().or(z.boolean()).default(true).optional(),
  allow_update: z.string().or(z.boolean()).default(true).optional(),
  allow_delete: z.string().or(z.boolean()).default(true).optional(),
  allow_create: z.string().or(z.boolean()).default(true).optional(),
});

export const IRolePermissionUpdateDTOSchema = z.object({
  role_id: z.string().uuid().optional(),
  permission_id: z.string().uuid(),
  allow_read: z.string().or(z.boolean()).default(true).optional(),
  allow_update: z.string().or(z.boolean()).default(true).optional(),
  allow_delete: z.string().or(z.boolean()).default(true).optional(),
  allow_create: z.string().or(z.boolean()).default(true).optional(),
});

export const IRoleCreateDTOSchema = z.object({
  name: z.string(),
  permissions: z.array(IRolePermissionCreateDTOSchema).optional(),
});

export const IRoleUpdateDTOSchema = z.object({
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const IRoleConditionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.string().optional().default(BaseOrder.DESC),
  sortBy: z.string().optional().default(BaseSortBy.CREATED_AT),
  include_users: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_user_image: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  is_get_all: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_permissions: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
});

export type IRoleCreateDTO = z.infer<typeof IRoleCreateDTOSchema>;
export type IRoleUpdateDTO = z.infer<typeof IRoleUpdateDTOSchema>;
export type IRoleConditionDTO = z.infer<typeof IRoleConditionSchema>;
export type IRolePermissionCreateDTO = z.infer<
  typeof IRolePermissionCreateDTOSchema
>;
export type IRolePermissionUpdateDTO = z.infer<
  typeof IRolePermissionUpdateDTOSchema
>;
