import { ModelStatus } from "@/app/shared/models/others/status.model";

export type CreateProductDTO = {
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
  includeDiscount?: boolean;
  includeCategory?: boolean;
  includeVariant?: boolean;
  includeImage?: boolean;
  includeReview?: boolean;
};
