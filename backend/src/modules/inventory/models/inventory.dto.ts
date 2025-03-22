import { BaseOrder, ModelStatus } from 'src/share/models/base-model';
import z from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { StockStatus } from 'src/modules/inventory/models/inventory.model';

export const InventoryWarehouseCreateDTOSchema = z.object({
  inventory_id: z.string().uuid().optional(),
  warehouse_id: z.string().uuid(),
  quantity: z.number().min(0),
  cost: z.number().min(0),
  total_cost: z.number().min(0).optional(),
});

export const InventoryWarehouseUpdateDTOSchema = z.object({
  inventory_id: z.string().uuid().optional(),
  warehouse_id: z.string().uuid().optional(),
  quantity: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  total_cost: z.number().min(0).optional(),
});

export enum InventorySortBy {
  TOTAL_QUANTITY = 'total_quantity',
  ASC = 'ASC',
  DESC = 'DESC',
}
export const InventoryCreateDTOSchema = z.object({
  total_quantity: z.number().min(0).optional(),
  total_cost: z.number().min(0).optional(),
  avg_cost: z.number().min(0).optional(),
  product_sellable_id: z.string().uuid(),
  low_stock_threshold: z.number().min(0).default(0).optional(),
  high_stock_threshold: z.number().min(0).default(9999999).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  inventory_warehouse: z.array(InventoryWarehouseCreateDTOSchema),
});

export enum InventoryUpdatedType {
  CREATE_NEW_ORDER = 'CREATE_NEW_ORDER',
  UPDATE_EXISTING_ORDER = 'UPDATE_EXISTING_ORDER',
}

export const InventoryUpdateDTOSchema = z.object({
  total_quantity: z.number().min(0).optional(),
  total_cost: z.number().min(0).optional(),
  avg_cost: z.number().min(0).optional(),
  low_stock_threshold: z.number().min(0).optional(),
  high_stock_threshold: z.number().min(0).optional(),
  note: z.string().optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  inventory_warehouse: z.array(InventoryWarehouseUpdateDTOSchema).optional(),
  type: z.nativeEnum(InventoryUpdatedType).optional(),
  order_quantity: z.number().min(0).optional(),
});

export const InventoryConditionDTOSchema = z.object({
  product_sellable_id: z.string().uuid().optional(),
  total_quantity: z.number().min(0).optional(),
  total_cost: z.number().min(0).optional(),
  avg_cost: z.number().min(0).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  stock_status: z.nativeEnum(StockStatus).optional(),
  low_stock_threshold: z.number().min(0).optional(),
  high_stock_threshold: z.number().min(0).optional(),
  note: z.string().optional(),
  include_all: z.boolean().optional(),
  include_product_sellable: z
    .boolean()
    .or(z.string().refine((value) => value === 'true' || value === 'false'))
    .transform((value) => value === 'true')
    .optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  cost: z.number().min(0).optional(),
  sortBy: z.nativeEnum(InventorySortBy).optional(),
  order: z.nativeEnum(BaseOrder).optional(),
  include_inventory_warehouse: z
    .boolean()
    .or(z.string().refine((value) => value === 'true' || value === 'false'))
    .transform((value) => value === 'true')
    .optional(),
});

export type InventoryCreateDTO = z.infer<typeof InventoryCreateDTOSchema>;
export type InventoryUpdateDTO = z.infer<typeof InventoryUpdateDTOSchema>;
export type InventoryConditionDTO = z.infer<typeof InventoryConditionDTOSchema>;
export type InventoryWarehouseCreateDTO = z.infer<
  typeof InventoryWarehouseCreateDTOSchema
>;
export type InventoryWarehouseUpdateDTO = z.infer<
  typeof InventoryWarehouseUpdateDTOSchema
>;
