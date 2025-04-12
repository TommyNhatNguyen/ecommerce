import { BaseOrder, BaseSortBy } from "@/app/shared/models/others/status.model";
import { Dayjs } from "dayjs";

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export enum DiscountScope {
  PRODUCT = "product",
  ORDER = "order",
}

export type CreateDiscountDTO = {
  name: string;
  description?: string;
  amount: number;
  is_fixed: boolean;
  max_discount_count?: number;
  discount_count?: number;
  require_product_count?: number;
  require_order_amount?: number;
  is_free?: boolean;
  scope: DiscountScope;
  start_date: string;
  end_date: string;
};

export type UpdateDiscountDTO = {
  name: string;
  description?: string;
  amount: number;
  is_fixed: boolean;
  max_discount_count?: number;
  discount_count?: number;
  require_product_count?: number;
  require_order_amount?: number;
  is_free?: boolean;
  scope: DiscountScope;
  start_date: string;
  end_date: string;
};

export type DiscountConditionDTO = {
  scope?: DiscountScope;
  ids?: string[];
  name?: string;
  min_amount?: number;
  max_amount?: number;
  start_date?: Date;
  end_date?: Date;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
  order?: BaseOrder;
  sortBy?: BaseSortBy;
  page?: number;
  limit?: number;
};
