import { ModelStatus } from "@/app/shared/models/others/status.model";

export enum InventoryInvoiceType {
  SALE_INVOICE = "SALE_INVOICE",
  IMPORT_INVOICE = "IMPORT_INVOICE",
  DISCARD_INVOICE = "DISCARD_INVOICE",
  UPDATE_COST_INVOICE = "UPDATE_COST_INVOICE",
  TRANSFER_INVOICE = "TRANSFER_INVOICE",
  RETURN_IMPORT_INVOICE = "RETURN_IMPORT_INVOICE",
  CUSTOMER_RETURN_INVOICE = "CUSTOMER_RETURN_INVOICE",
  CHECK_INVENTORY = "CHECK_INVENTORY",
}
export interface InvoicesCreateDTO {
  type: InventoryInvoiceType;
  quantity: number;
  amount: number;
  cost: number;
  note?: string;
  code: string;
  inventory_id: string;
  warehouse_id: string;
  status?: ModelStatus;
}

export interface TransferInvoicesCreateDTO {
  inventory_id: string;
  warehouse_id_from: string;
  warehouse_id_to: string;
  quantity: number;
  code: string;
  note?: string;
  status?: ModelStatus;
}

export interface CheckInventoryInvoicesCreateDTO {
  warehouse_id: string;
  inventory_data: {
    inventory_id: string;
    actual_quantity: number;
  }[];
  note?: string;
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
  include_inventory?: boolean;
  include_warehouse?: boolean;
  include_product?: boolean;
  warehouse_ids?: string[];
  invoices_types?: string[];
}
