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
}

export interface WarehouseCreateDTO {
  name: string;
  description: string;
  address: string;
}

export interface WarehouseUpdateDTO {
  name?: string;
  description?: string;
  address?: string;
}