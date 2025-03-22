import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { BaseOrder, BaseSortBy, ModelStatus } from "@/app/shared/models/others/status.model";

export type InventoryUpdateDTO = {
  quantity?: number;
  low_stock_threshold?: number;
  stock_status?: StockStatus;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
};

export type InventoryWarehouseCreateDTO = {
  warehouse_id: string;
  quantity: number;
  cost: number;
}

export type InventoryConditionDTO = {
  warehouse_id?: string;
  product_sellable_id?: string;
  total_quantity?: number;
  total_cost?: number;
  avg_cost?: number;
  status?: ModelStatus;
  stock_status?: StockStatus;
  low_stock_threshold?: number;
  high_stock_threshold?: number;
  note?: string;
  created_at?: Date;
  updated_at?: Date;
  cost?: number;
  sortBy?: BaseSortBy;
  order?: BaseOrder;
  include_all?: boolean;
  include_product_sellable?: boolean;
  include_inventory_warehouse?: boolean;
  page?: number;
  limit?: number;
}
