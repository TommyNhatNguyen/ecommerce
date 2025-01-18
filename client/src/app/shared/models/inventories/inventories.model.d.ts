import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export type InventoryModel = {
  id: string;
  quantity: number;
  low_stock_threshold?: number;
  stock_status?: StockStatus;
  status?: ModelStatus;
  total_value?: number;
  created_at?: Date;
  updated_at?: Date;
  product_id?: string;
};
