import { BaseOrder, BaseSortBy } from "@/app/shared/models/others/status.model";

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
  type: DiscountType;
  scope: DiscountScope;
  start_date: string;
  end_date: string;
};

export type UpdateDiscountDTO = {
  name?: string;
  description?: string;
  amount?: number;
  type?: DiscountType;
  scope?: DiscountScope;
  start_date?: Date;
  end_date?: Date;
  status?: ModelStatus;
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
};
