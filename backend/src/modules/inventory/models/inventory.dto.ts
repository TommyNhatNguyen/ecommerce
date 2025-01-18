import {
  BaseOrder,
  ModelStatus,
} from 'src/share/models/base-model';
import z from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { StockStatus } from 'src/modules/inventory/models/inventory.model';
export const InventoryCreateDTOSchema = z.object({
  quantity: z.number().min(0),
  cost: z.number().min(0),
  product_id: z.string().uuid(),
  low_stock_threshold: z.number().min(0).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  total_value: z.number().min(0).optional(),
});

export const InventoryUpdateDTOSchema = z.object({
  quantity: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  low_stock_threshold: z.number().min(0).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  total_value: z.number().min(0).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export enum InventorySortBy {
  QUANTITY = 'quantity',
  ASC = 'ASC',
  DESC = 'DESC',
}

export const InventoryConditionDTOSchema = z.object({
  quantity: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  low_stock_threshold: z.number().min(0).optional(),
  total_value: z.number().min(0).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  cost: z.number().min(0).optional(),
  sortBy: z.nativeEnum(InventorySortBy).optional(),
  order: z.nativeEnum(BaseOrder).optional(),
});

export type InventoryCreateDTO = z.infer<typeof InventoryCreateDTOSchema>;
export type InventoryUpdateDTO = z.infer<typeof InventoryUpdateDTOSchema>;
export type InventoryConditionDTO = z.infer<typeof InventoryConditionDTOSchema>;
