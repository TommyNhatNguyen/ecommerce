import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventorySchema } from 'src/modules/inventory/models/inventory.model';
import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export enum InventoryInvoiceType {
  SALE_INVOICE = 'SALE_INVOICE',
  IMPORT_INVOICE = 'IMPORT_INVOICE',
  DISCARD_INVOICE = 'DISCARD_INVOICE',
  UPDATE_COST_INVOICE = 'UPDATE_COST_INVOICE',
  TRANSFER_INVOICE = 'TRANSFER_INVOICE',
  RETURN_IMPORT_INVOICE = 'RETURN_IMPORT_INVOICE',
  CUSTOMER_RETURN_INVOICE = 'CUSTOMER_RETURN_INVOICE',
  CHECK_INVENTORY_INVOICE = 'CHECK_INVENTORY_INVOICE',
}

export const InventoryInvoiceSchema = z.object({
  id: z.string().uuid(),
  inventory_id: z.string().uuid(),
  type: z.nativeEnum(InventoryInvoiceType),
  quantity: z.number(),
  amount: z.number(),
  cost: z.number(),
  note: z.string().optional(),
  code: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  [inventoryModelName]: z.array(InventorySchema).optional(),
});

export type InventoryInvoice = z.infer<typeof InventoryInvoiceSchema>;
