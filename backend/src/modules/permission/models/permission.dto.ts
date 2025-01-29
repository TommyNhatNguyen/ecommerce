import { BaseOrder, BaseSortBy, ModelStatus, PermissionType, ResourcesType } from 'src/share/models/base-model';
import z from 'zod';

export const PermissionCreateDTOSchema = z.object({
  type: z.nativeEnum(ResourcesType),
});

export const PermissionUpdateDTOSchema = z.object({
  type: z.nativeEnum(ResourcesType).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const PermissionConditionDTOSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(ResourcesType).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
  is_get_all: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_role: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
});

export type PermissionCreateDTO = z.infer<typeof PermissionCreateDTOSchema>;
export type PermissionUpdateDTO = z.infer<typeof PermissionUpdateDTOSchema>;
export type PermissionConditionDTO = z.infer<typeof PermissionConditionDTOSchema>;
