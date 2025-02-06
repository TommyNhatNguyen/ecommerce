import { ProductStatsSortBy } from "@/app/shared/interfaces/products/product.dto";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { BaseOrder, ModelStatus } from "@/app/shared/models/others/status.model";

export type CreateProductSellableDTO = {
  price: number;
  quantity?: number;
  low_stock_threshold?: number;
  cost?: number;
  status?: ModelStatus;
  discountIds?: string[];
  imageIds?: string[];
};

export type ProductSellableCondition = {
  ids?: string[];
  status?: ModelStatus;
  minPrice?: number | string;
  maxPrice?: number | string;
  minQuantity?: number | string;
  maxQuantity?: number | string;
  order?: BaseOrder;
  sortBy?: ProductStatsSortBy;
  fromCreatedAt?: string;
  toCreatedAt?: string;
  includeProduct?: boolean;
  includeDiscount?: boolean;
  includeImage?: boolean;
  includeVariant?: boolean;
  page?: number;
  limit?: number;
};
