import { ModelStatus } from 'src/share/models/base-model';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';

export const ProductCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7()),
  name: z.string(),
  price: z.number().nonnegative().min(0),
});

export const ProductUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ProductConditionDTOSchema = z.object({
  id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  price: z.number().nonnegative().min(0).optional().default(0),
});

export type ProductCreateDTOSchema = z.infer<typeof ProductCreateDTOSchema>;
export type ProductUpdateDTOSchema = z.infer<typeof ProductUpdateDTOSchema>;
export type ProductConditionDTOSchema = z.infer<
  typeof ProductConditionDTOSchema
>;
