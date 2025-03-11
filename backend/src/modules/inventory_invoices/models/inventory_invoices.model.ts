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
}

export const InventoryInvoiceSchema = z.object({
  id: z.string().uuid(),
  inventory_id: z.string().uuid(),
  type: z.nativeEnum(InventoryInvoiceType),
  quantity: z.number(),
  amount: z.number(),
  note: z.string().optional(),
  code: z.string(),
  status: z.nativeEnum(ModelStatus),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type InventoryInvoice = z.infer<typeof InventoryInvoiceSchema>;
