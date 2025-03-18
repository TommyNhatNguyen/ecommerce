import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { ProductSellableModel } from "@/app/shared/models/products/products-sellable.model";
import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";

export type InventoryModel = {
  id: string;
  total_quantity: number;
  total_cost: number;
  avg_cost: number;
  low_stock_threshold?: number;
  high_stock_threshold?: number;
  note?: string;
  stock_status?: StockStatus;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
  product_id?: string;
  product_sellable: ProductSellableModel;
  product_sellable_id: string;
  warehouse: WarehouseModel[];
  warehouse_id: string;
  inventory_warehouse: InventoryWarehouseModel;
};

export type InventoryWarehouseModel = {
  inventory_id: string;
  warehouse_id: string;
  quantity: number;
  cost: number;
  total_cost: number;
  status: ModelStatus;
  created_at: Date;
  updated_at: Date;
};
