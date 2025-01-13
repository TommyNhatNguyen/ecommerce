import { PRODUCT_STATS_GROUP_BY } from "@/app/constants/product-stats";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { DateString } from "@/app/shared/types/datestring.model";
import { UploadFile } from "antd";

export type CreateProductDTO = {
  name: string;
  description?: string;
  price: number | string;
  categoryIds: string[];
  discountIds: string[];
  variantIds?: string[];
  imageFileList?: UploadFile[];
  quantity: number | string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
};

export type CreateProductBodyDTO = {
  name: string;
  description?: string;
  price: number | string;
  categoryIds: string[];
  discountIds: string[];
  variantIds?: string[];
  imageIds?: string[];
  quantity: number | string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
};

export type UpdateProductDTO = {
  name?: string;
  description?: string;
  price?: number | string;
  status?: ModelStatus;
  categoryIds?: string[];
  discountIds?: string[];
  variantIds?: string[];
  imageIds?: string[];
  quantity?: number | string;
};

export enum ProductStatsSortBy {
  PRODUCT_PRICE = "price",
  INVENTORY_QUANTITY = "inventory_quantity",
  DISCOUNT_PERCENTAGE = "discount_percentage",
  INVENTORY_VALUE = "inventory_value",
}

export type GetProductsBodyDTO = {
  limit?: number;
  page?: number;
  status?: ModelStatus;
  minPrice?: number | string;
  maxPrice?: number | string;
  name?: string;
  categoryIds?: string[];
  order?: BaseOrder;
  sortBy?: ProductStatsSortBy | BaseSortBy;
  fromCreatedAt?: DateString;
  toCreatedAt?: DateString;
  includeDiscount?: boolean;
  includeCategory?: boolean;
  includeVariant?: boolean;
  includeImage?: boolean;
  includeReview?: boolean;
};

export enum ProductStatsType {
  CATEGORY = "category",
  DISCOUNT = "discount",
  STATUS = "status",
  STOCK_STATUS = "stock_status",
}

export type ProductGetStatsCondition = {
  groupBy: ProductStatsType;
};
