import {
  DiscountScope,
  DiscountType,
} from "@/app/shared/interfaces/discounts/discounts.dto";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";

export type ProductModel = {
  id: string;
  name: string;
  description: string;
  short_description: string;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  category?: CategoryModel[];
  variant?: VariantProductModel[];
  image?: ImageModel[];
};

export type ProductStatsModel = {
  totalInventoryQuantity: {
    total: number;
    product_count?: number;
    name?: string;
  }[];
};
