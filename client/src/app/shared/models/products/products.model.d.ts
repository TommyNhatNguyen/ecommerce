import {
  DiscountScope,
  DiscountType,
} from "@/app/shared/interfaces/discounts/discounts.dto";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export type ProductModel = {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  inventory: InventoryModel;
  discount?: DiscountModel[];
  category?: CategoryModel[];
  image?: ImageModel[];
};

export type ProductStatsModel = {
  totalInventoryQuantity: {
    total: number;
    product_count?: number;
    name?: string;
  }[];
};
