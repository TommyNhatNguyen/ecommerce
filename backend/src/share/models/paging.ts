import { z } from 'zod';

export const PagingDTOSchema = z.object({
  // Cho phép auto cast từ string sang number
  page: z.coerce.number().min(1).positive().int().default(1),
  limit: z.coerce.number().min(1).max(5000).positive().int().default(10),
});

export type PagingDTO = z.infer<typeof PagingDTOSchema>;


export const MetaSchema = z.object({
  total_count: z.number().positive().int(),
  current_page: z.number().positive().int(),
  total_page: z.number().positive().int(),
  limit: z.number().positive().int(),
});

export type Meta = z.infer<typeof MetaSchema>;
