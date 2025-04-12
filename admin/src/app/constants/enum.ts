import {
  DiscountScope,
  DiscountType,
} from "@/app/shared/interfaces/discounts/discounts.dto";
import { NumberType } from "@/app/shared/models/others/number-type.model";

export const DISCOUNT_TYPE: Record<string, DiscountType> = {
  PERCENTAGE: "percentage" as DiscountType,
  FIXED: "fixed" as DiscountType,
};

export const DISCOUNT_SCOPE: Record<string, DiscountScope> = {
  PRODUCT: "product" as DiscountScope,
  ORDER: "order" as DiscountScope,
};

export const NUMBER_TYPE: Record<string, NumberType> = {
  PERCENTAGE: "percentage" as NumberType,
  FIXED: "fixed" as NumberType,
};
