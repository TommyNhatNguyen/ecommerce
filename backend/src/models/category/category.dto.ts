import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';

export const CategoryCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  name: z.string(),
  description: z.string().optional(),
});

export const CategoryUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type CategoryCreateDTOSchema = z.infer<typeof CategoryCreateDTOSchema>;
export type CategoryUpdateDTOSchema = z.infer<typeof CategoryUpdateDTOSchema>;
