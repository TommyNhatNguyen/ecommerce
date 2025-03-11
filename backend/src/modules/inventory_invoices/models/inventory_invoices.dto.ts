import { InventoryInvoiceType } from 'src/modules/inventory_invoices/models/inventory_invoices.model';
import { BaseOrder, BaseSortBy, ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const InventoryInvoiceCreateDTOSchema = z.object({
  type: z.nativeEnum(InventoryInvoiceType).optional(),
  quantity: z.number().optional(),
  amount: z.number().optional(),
  note: z.string().optional(),
  code: z.string().optional(),
  status: z.nativeEnum(ModelStatus).default(ModelStatus.ACTIVE).optional(),
});

export const InventoryInvoiceUpdateDTOSchema = z.object({
  type: z.nativeEnum(InventoryInvoiceType).optional(),
  quantity: z.number().optional(),
  amount: z.number().optional(),
  note: z.string().optional(),
  code: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export const InventoryInvoiceConditionDTOSchema = z.object({
  ids: z.array(z.string().uuid()).optional(),
  inventory_ids: z.array(z.string().uuid()).optional(),
  type: z.nativeEnum(InventoryInvoiceType).optional(),
  quantity: z.number().optional(),
  amount: z.number().optional(),
  note: z.string().optional(),
  code: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  sortBy: z.nativeEnum(BaseSortBy).optional(),
  orderBy: z.nativeEnum(BaseOrder).optional(),
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
