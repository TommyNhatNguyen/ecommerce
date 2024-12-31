import { ModelStatus } from "@/app/shared/models/others/status.model";

export type CreateProductDTO = {
  productName: string;
  category: string[];
  description: string;
  price: number | string;
  stock: number | string;
  discountCampaign: string;
  status: "publish" | "unpublish";
};

export type GetProductsBodyDTO = {
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
