import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from "../../models/others/status.model";

export type VariantCreateDTO = {
  type: string;
  name: string;
  value: string;
};

export type VariantConditionDTO = {
  type?: string;
  name?: string;
  value?: string;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  order?: BaseOrder;
  sortBy?: BaseSortBy;
  page?: number;
  limit?: number;
};

export type VariantUpdateDTO = {
  type?: string;
  name?: string;
  value?: string;
  status?: ModelStatus;
};
