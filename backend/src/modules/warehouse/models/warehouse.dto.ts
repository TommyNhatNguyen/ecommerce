import { BaseOrder, BaseSortBy, ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const WarehouseCreateDTOSchema = z.object({
  name: z.string(),
  description: z.string(),
  address: z.string(),
  total_quantity: z.number().min(0),
  total_cost: z.number().min(0),
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
});

export type WarehouseCreateDTO = z.infer<typeof WarehouseCreateDTOSchema>;
export type WarehouseUpdateDTO = z.infer<typeof WarehouseUpdateDTOSchema>;
export type WarehouseConditionDTO = z.infer<typeof WarehouseConditionDTOSchema>;
