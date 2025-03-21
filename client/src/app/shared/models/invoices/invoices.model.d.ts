import { InventoryInvoiceType } from "@/app/shared/interfaces/invoices/invoices.dto";
import { ModelStatus } from "../others/status.model";

export interface InvoicesModel {
  id: string;
  inventory_id: string;
  type: InventoryInvoiceType;
  quantity: number;
  amount: number;
  cost: number;
  note: string;
  code: string;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
}