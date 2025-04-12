import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface WarehouseConditionDTO {
  name?: string;
  description?: string;
  address?: string;
  total_quantity?: number;
  total_cost?: number;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  order?: BaseOrder;
  sortBy?: BaseSortBy;
  page?: number;
  limit?: number;
  include_inventory?: boolean;
  include_product_sellable?: boolean;
}

export interface WarehouseCreateDTO {
  name: string;
  description: string;
  address: string;
  status?: ModelStatus;
}

export interface WarehouseUpdateDTO {
  name?: string;
  description?: string;
  address?: string;
  status?: ModelStatus;
}