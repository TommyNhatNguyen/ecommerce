import { BaseOrder, BaseSortBy, ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const WarehouseCreateDTOSchema = z.object({
  name: z.string(),
  description: z.string(),
  address: z.string(),
  total_quantity: z.number().min(0).default(0).optional(),
  total_cost: z.number().min(0).default(0).optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const WarehouseUpdateDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  total_quantity: z.number().min(0).optional(),
  total_cost: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const WarehouseConditionDTOSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  total_quantity: z.number().min(0).optional(),
  total_cost: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  include_inventory: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
  include_product_sellable: z
    .string()
    .refine((value) => value === 'true' || value === 'false')
    .transform((value) => value === 'true')
    .optional(),
});

export type WarehouseCreateDTO = z.infer<typeof WarehouseCreateDTOSchema>;
export type WarehouseUpdateDTO = z.infer<typeof WarehouseUpdateDTOSchema>;
export type WarehouseConditionDTO = z.infer<typeof WarehouseConditionDTOSchema>;
