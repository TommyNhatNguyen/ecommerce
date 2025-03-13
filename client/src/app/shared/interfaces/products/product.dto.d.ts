import { PRODUCT_STATS_GROUP_BY } from "@/app/constants/product-stats";
import { CreateProductSellableDTO } from "@/app/shared/interfaces/products/product-sellable.dto";
import { CreateVariantDTOV2 } from "@/app/shared/interfaces/variant/variant.interface";
import {
  BaseOrder,
  BaseSortBy,
  ModelStatus,
} from "@/app/shared/models/others/status.model";
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
  cost?: number | string;
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
  cost: number | string;
};

export type CreateProductDTOV2 = {
  name: string;
  description?: string;
  short_description?: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  categoryIds: string[];
  variants: {
    variant_data: CreateVariantDTOV2;
    product_sellables: CreateProductSellableDTO;
  }[];
};

export type UpdateProductDTO = {
  name: string;
  description?: string;
  short_description?: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  categoryIds: string[];
  variants: {
    variant_data: CreateVariantDTOV2;
    product_sellables: CreateProductSellableDTO;
  }[];
};

export enum ProductStatsSortBy {
  PRODUCT_PRICE = "price",
  INVENTORY_QUANTITY = "inventory_quantity",
  DISCOUNT_PERCENTAGE = "discount_percentage",
  INVENTORY_VALUE = "inventory_value",
}

export type ProductConditionDTO = {
  limit?: number;
  page?: number;
  status?: ModelStatus;
  priceRange?: {
    from: number;
    to: number;
  };
  name?: string;
  categoryIds?: string[];
  order?: BaseOrder;
  sortBy?: ProductStatsSortBy | BaseSortBy;
  fromCreatedAt?: DateString;
  toCreatedAt?: DateString;
  includeVariant?: boolean;
  includeVariantInfo?: boolean;
  includeVariantInventory?: boolean;
  includeCategory?: boolean;
  includeImage?: boolean;
  includeDiscount?: boolean;
  includeReview?: boolean;
  includeVariantOption?: boolean;
  includeVariantOptionType?: boolean;
  includeVariantImage?: boolean;
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
