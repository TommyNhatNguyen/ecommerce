import { CreateProductSellableDTO } from "@/app/shared/interfaces/products/product-sellable.dto";
import { BaseOrder, BaseSortBy, ModelStatus } from "../../models/others/status.model";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";

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
  option_value_ids?: string[];
  order?: BaseOrder;
  sortBy?: BaseSortBy;
  product_id?: string;
  include_options_value?: boolean;
  include_option?: boolean;
  include_product_sellable?: boolean;
  include_product?: boolean;
  include_inventory?: boolean;
  include_warehouse?: boolean;
  include_brand?: boolean;
  page?: number;
  limit?: number;
  stock_statuses?: string[];
  statuses?: ModelStatus[];
  warehouseIds?: string[];
  brandIds?: string[];
  productIds?: string[];
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
  sku?: string;
  options_value_ids: string[];
  product_sellables: CreateProductSellableDTO;
  product_id?: string;
};

export type OptionCreateDTO = {
  name: string;
  label?: string;
  is_color?: boolean;
  option_values: OptionValueCreateDTO[];
};

export type OptionUpdateDTO = {
  name?: string;
  label?: string;
  is_color?: boolean;
  option_values: OptionValueUpdateDTO[];
};

export type OptionValueUpdateDTO = {
  name?: string;
  value?: string;
};

export type OptionValueCreateDTO = {
  name: string;
  value: string;
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
  include_variant?: boolean;
  include_variant_info?: boolean;
  product_id?: string;
  is_color?: boolean;
  page?: number;
  limit?: number;
};

export type VariantBulkDeleteDTO = {
  ids: string[];
};
