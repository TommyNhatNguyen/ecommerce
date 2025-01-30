import { BaseOrder, BaseSortBy } from "@/app/shared/models/others/status.model";

export enum ImageType {
  CATEGORY = "CATEGORY",
  CUSTOMER = "CUSTOMER",
  DISCOUNT = "DISCOUNT",
  IMAGE = "IMAGE",
  INVENTORY = "INVENTORY",
  ORDER = "ORDER",
  PAYMENT = "PAYMENT",
  PERMISSION = "PERMISSION",
  PRODUCT = "PRODUCT",
  REVIEW = "REVIEW",
  ROLE = "ROLE",
  SHIPPING = "SHIPPING",
  USER = "USER",
  VARIANT = "VARIANT",
  OTHER = "OTHER",
}

export type ImageCreateDTO = {
  type: ImageType;
};

export type ImageConditionDTO = {
  page?: number;
  limit?: number;
  typeList?: ImageType[];
  id?: string;
  url?: string;
  cloudinary_id?: string;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
  orderBy?: BaseOrder;
  sortBy?: BaseSortBy;
};
