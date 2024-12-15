import { z } from 'zod';

export const PagingDTOSchema = z.object({
  // Cho phép auto cast từ string sang number
  page: z.coerce.number().min(1).positive().int().default(1),
  limit: z.coerce.number().min(1).max(100).positive().int().default(10),
});

export type PagingDTO = z.infer<typeof PagingDTOSchema>;
