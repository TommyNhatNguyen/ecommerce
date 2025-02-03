import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from "../../models/others/status.model";

export type VariantCreateDTO = {
  type: string;
  name: string;
  value: string;
  is_color?: boolean;
};

export type VariantConditionDTO = {
  type?: string;
  name?: string;
  value?: string;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  is_color?: boolean;
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
  is_color?: boolean;
};

export type CreateVariantDTOV2 = {
  name: string;
  options_value_ids: string[];
};

export type OptionValueConditionDTO = {
  name?: string;
  value?: string;
  option_id?: string;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  order?: BaseOrder;
  sortBy?: BaseSortBy;
  page?: number;
  limit?: number;
};

export type OptionConditionDTO = {
  name?: string;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  order?: BaseOrder;
  sortBy?: BaseSortBy;
  include_option_values?: boolean;
  is_color?: boolean;
  page?: number;
  limit?: number;
};
