import { ProductSellableModel } from "@/app/shared/models/products/products-sellable.model";
import { ModelStatus } from "../others/status.model";


export type VariantProductModel = {
  id: string;
  name: string;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  product_id: string;
  product_sellable?: ProductSellableModel;
  option_values?: OptionValueModel[];
};

export type OptionValueModel = {
  id: string;
  name: string;
  value: string;
  option_id: string;
  created_at: string;
  updated_at: string;
  status: ModelStatus;
  options?: OptionModel;
};

export type OptionModel = {
  id: string;
  name: string;
  is_color: boolean;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  option_values?: OptionValueModel[];
};
