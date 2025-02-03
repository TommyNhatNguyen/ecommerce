import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export type CreateProductSellableDTO = {
  price: number;
  quantity?: number;
  low_stock_threshold?: number;
  cost?: number;
  status?: ModelStatus;
  discountIds?: string[];
  imageIds?: string[];
};
