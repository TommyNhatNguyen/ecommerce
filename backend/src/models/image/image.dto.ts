import z from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { BaseOrder, BaseSortBy, ModelStatus, PermissionType, ResourcesType } from 'src/share/models/base-model';

export const ImageCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  url: z.string(),
  cloudinary_id: z.string(),
  type: z
    .nativeEnum({ ...ResourcesType, OTHER: 'OTHER' })
    .optional()
    .default('OTHER'),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE).optional(),
});
export const ImageUpdateDTOSchema = z.object({
  url: z.string().optional(),
  cloudinary_id: z.string().optional(),
  type: z
    .nativeEnum({ ...ResourcesType, OTHER: 'OTHER' })
    .optional()
    .default('OTHER'),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const ImageConditionSchema = z.object({
  typeList: z.array(z.nativeEnum({ ...ResourcesType, OTHER: 'OTHER' })).optional(),
  id: z.string().optional(),
  url: z.string().optional(),
  cloudinary_id: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  orderBy: z.nativeEnum(BaseOrder).optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
});

export type ImageCreateDTO = z.infer<typeof ImageCreateDTOSchema>;
export type ImageUpdateDTO = z.infer<typeof ImageUpdateDTOSchema>;
export type ImageConditionDTO = z.infer<typeof ImageConditionSchema>;
