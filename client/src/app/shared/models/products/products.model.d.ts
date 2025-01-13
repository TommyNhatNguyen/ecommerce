import { CategoryModel } from "@/app/shared/models/categories/categories.model";
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
  inventory: {
    id?: string;
    quantity?: number;
    low_stock_threshold?: number;
    stock_status: StockStatus;
    cost?: number;
  };
  discount?: {
    id?: string;
    name?: string;
    type?: string;
    discount_percentage?: number;
    description?: string;
    end_date?: string;
    start_date?: string;
  }[];
  category?: {
    id?: string;
    name?: string;
    image_id?: string;
    description?: string;
  }[];
  image?: {
    id?: string;
    type?: string;
    url?: string;
    cloudinary_id?: string;
  }[];
};

export type ProductStatsModel = {
  totalInventoryQuantity: {
    total: number;
    product_count?: number;
    name?: string;
  }[];
};
