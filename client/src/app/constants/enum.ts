import {
  DiscountScope,
  DiscountType,
} from "@/app/shared/interfaces/discounts/discounts.dto";

export const DISCOUNT_TYPE: Record<string, DiscountType> = {
  PERCENTAGE: "percentage" as DiscountType,
  FIXED: "fixed" as DiscountType,
};

export const DISCOUNT_SCOPE: Record<string, DiscountScope> = {
  PRODUCT: "product" as DiscountScope,
  ORDER: "order" as DiscountScope,
};
