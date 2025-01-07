import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export type InventoryUpdateDTO = {
  quantity?: number;
  low_stock_threshold?: number;
  stock_status?: StockStatus;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
};

