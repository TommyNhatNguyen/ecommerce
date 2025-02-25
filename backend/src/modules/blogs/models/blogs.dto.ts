import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from 'src/share/models/base-model';

export const BlogsCreateDTOSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  thumnail_url: z.string(),
  user_id: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const BlogsUpdateDTOSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE).optional(),
  thumnail_url: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const BlogsConditionDTOSchema = z.object({
  name: z.string().optional(),
  id: z.string().uuid().optional(),
  include_users: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_image: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_all: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  order: z.string().default(BaseOrder.DESC).optional(),
  sortBy: z.string().default(BaseSortBy.CREATED_AT).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type BlogsCreateDTOSchema = z.infer<typeof BlogsCreateDTOSchema>;
export type BlogsUpdateDTOSchema = z.infer<typeof BlogsUpdateDTOSchema>;
export type BlogsConditionDTOSchema = z.infer<typeof BlogsConditionDTOSchema>;
