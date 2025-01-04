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

export type GetProductsBodyDTO = {
  limit?: number;
  page?: number;
  status?: ModelStatus;
  minPrice?: number | string;
  maxPrice?: number | string;
  name?: string;
  categoryIds?: string[];
  order?: BaseOrder;
  sortBy?: BaseSortBy;
  fromCreatedAt?: DateString;
  toCreatedAt?: DateString;
  includeDiscount?: boolean;
  includeCategory?: boolean;
  includeVariant?: boolean;
  includeImage?: boolean;
  includeReview?: boolean;
};
