import { ImageType } from "@/app/shared/interfaces/image/image.dto";

export const IMAGE_TYPE = {
  CATEGORY: "CATEGORY",
  CUSTOMER: "CUSTOMER",
  DISCOUNT: "DISCOUNT",
  IMAGE: "IMAGE",
  INVENTORY: "INVENTORY",
  ORDER: "ORDER",
  PAYMENT: "PAYMENT",
  PERMISSION: "PERMISSION",
  PRODUCT: "PRODUCT",
  REVIEW: "REVIEW",
  ROLE: "ROLE",
  SHIPPING: "SHIPPING",
  USER: "USER",
  VARIANT: "VARIANT",
  OTHER: "OTHER",
} as Record<string, ImageType>;