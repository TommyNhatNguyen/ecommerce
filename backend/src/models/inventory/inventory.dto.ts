import { BaseOrder, BaseSortBy, ModelStatus } from 'src/share/models/base-model';
import z from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { StockStatus } from '@models/inventory/inventory.model';
export const InventoryCreateDTOSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv7())
    .optional(),
  quantity: z.number().min(0),
  product_id: z.string().uuid(),
  low_stock_threshold: z.number().min(0).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
});

export const InventoryUpdateDTOSchema = z.object({
  quantity: z.number().min(0).optional(),
  low_stock_threshold: z.number().min(0).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
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
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  sortBy: z.nativeEnum(InventorySortBy).optional(),
  order: z.nativeEnum(BaseOrder).optional(),
});

export type InventoryCreateDTO = z.infer<typeof InventoryCreateDTOSchema>;
export type InventoryUpdateDTO = z.infer<typeof InventoryUpdateDTOSchema>;
export type InventoryConditionDTO = z.infer<typeof InventoryConditionDTOSchema>;
