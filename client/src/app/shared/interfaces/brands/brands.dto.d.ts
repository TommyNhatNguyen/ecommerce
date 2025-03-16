import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from "@/app/shared/models/others/status.model";

export interface BrandCreateDTO {
  name: string;
  description: string;
  created_at: Date | null;
  updated_at: Date | null;
  status: ModelStatus | null;
}

export interface BrandUpdateDTO {
  name?: string | null;
  description?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  status?: ModelStatus | null;
}

export interface BrandConditionDTO {
  name?: string | null;
  description?: string | null;
  status?: ModelStatus | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  sortBy?: BaseSortBy | null;
  order?: BaseOrder | null;
  page?: number | null;
  limit?: number | null;
}
