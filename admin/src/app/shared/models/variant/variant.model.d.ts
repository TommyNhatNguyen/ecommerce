import { ProductSellableModel } from "@/app/shared/models/products/products-sellable.model";
import { ModelStatus } from "../others/status.model";
import { ProductModel } from "@/app/shared/models/products/products.model";


export type VariantProductModel = {
  id: string;
  name: string;
  sku: string;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  product_id: string;
  product_sellable?: ProductSellableModel;
  option_values?: OptionValueModel[];
  product?: ProductModel;
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
  variant?: VariantProductModel[];
};

export type OptionModel = {
  id: string;
  name: string;
  label: string;
  is_color: boolean;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  option_values?: OptionValueModel[];
};
