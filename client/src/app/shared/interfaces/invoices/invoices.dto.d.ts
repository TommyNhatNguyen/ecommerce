import { ModelStatus } from "@/app/shared/models/others/status.model";

export enum InventoryInvoiceType {
  SALE_INVOICE = "SALE_INVOICE",
  IMPORT_INVOICE = "IMPORT_INVOICE",
  DISCARD_INVOICE = "DISCARD_INVOICE",
  UPDATE_COST_INVOICE = "UPDATE_COST_INVOICE",
  TRANSFER_INVOICE = "TRANSFER_INVOICE",
  RETURN_IMPORT_INVOICE = "RETURN_IMPORT_INVOICE",
  CUSTOMER_RETURN_INVOICE = "CUSTOMER_RETURN_INVOICE",
}
export interface InvoicesCreateDTO {
  type: InventoryInvoiceType;
  quantity: number;
  amount: number;
  cost: number;
  note: string;
  code: string;
  status?: ModelStatus;
}

export interface InvoicesUpdateDTO {
  type?: InventoryInvoiceType;
  quantity?: number;
  amount?: number;
  cost?: number;
  note?: string;
}

export interface InvoicesConditionDTO {
  type?: InventoryInvoiceType;
  inventory_id?: string;
  warehouse_id?: string;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  page?: number;
  limit?: number;
}
