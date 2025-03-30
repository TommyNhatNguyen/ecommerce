import { InventoryInvoiceType } from 'src/modules/inventory_invoices/models/inventory_invoices.model';
import { BaseOrder, BaseSortBy, ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const InventoryInvoiceCreateDTOSchema = z.object({
  type: z.nativeEnum(InventoryInvoiceType).optional(),
  quantity: z.number().optional(),
  amount: z.number().optional(),
  cost: z.number().optional(),
  note: z.string().optional(),
  code: z.string().optional(),
  inventory_id: z.string().uuid().optional(),
  warehouse_id: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE).optional(),
});

export const InventoryInvoiceCreateTransferDTOSchema = z.object({
  inventory_id: z.string().uuid().optional(),
  warehouse_id_from: z.string().uuid().optional(),
  warehouse_id_to: z.string().uuid().optional(),
  quantity: z.number().optional(),
  note: z.string().optional(),
  code: z.string().optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE).optional(),
});

export const InventoryInvoiceCreateCheckInventoryDTOSchema = z.object({
  warehouse_id: z.string().uuid(),
  inventory_data: z.array(
    z.object({
      inventory_id: z.string().uuid(),
      actual_quantity: z.number(),
    }),
  ),
  note: z.string().optional(),
  code: z.string(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE).optional(),
});

export const InventoryInvoiceUpdateDTOSchema = z.object({
  type: z.nativeEnum(InventoryInvoiceType).optional(),
  quantity: z.number().optional(),
  amount: z.number().optional(),
  cost: z.number().optional(),
  note: z.string().optional(),
  code: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  warehouse_id: z.string().uuid().optional(),
});

export const InventoryInvoiceConditionDTOSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  inventory_ids: z.array(z.string().uuid()).optional(),
  type: z.nativeEnum(InventoryInvoiceType).optional(),
  quantity: z.number().optional(),
  amount: z.number().optional(),
  cost: z.number().optional(),
  note: z.string().optional(),
  code: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  warehouse_id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
  orderBy: z.nativeEnum(BaseOrder).optional(),
  include_inventory: z
    .boolean()
    .or(z.string().refine((value) => value === 'true' || value === 'false'))
    .transform((value) => value === 'true')
    .optional(),
  include_warehouse: z
    .boolean()
    .or(z.string().refine((value) => value === 'true' || value === 'false'))
    .transform((value) => value === 'true')
    .optional(),
  include_product: z
    .boolean()
    .or(z.string().refine((value) => value === 'true' || value === 'false'))
    .transform((value) => value === 'true')
    .optional(),
  warehouse_ids: z.array(z.string().uuid()).optional(),
  invoices_types: z.array(z.nativeEnum(InventoryInvoiceType)).optional(),
});

export type InventoryInvoiceCreateDTO = z.infer<
  typeof InventoryInvoiceCreateDTOSchema
>;
export type InventoryInvoiceUpdateDTO = z.infer<
  typeof InventoryInvoiceUpdateDTOSchema
>;
export type InventoryInvoiceConditionDTO = z.infer<
  typeof InventoryInvoiceConditionDTOSchema
>;
export type InventoryInvoiceCreateTransferDTO = z.infer<
  typeof InventoryInvoiceCreateTransferDTOSchema
>;
export type InventoryInvoiceCreateCheckInventoryDTO = z.infer<
  typeof InventoryInvoiceCreateCheckInventoryDTOSchema
>;
