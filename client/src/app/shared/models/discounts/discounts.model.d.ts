import { DiscountScope, DiscountType } from "@/app/shared/interfaces/discounts/discounts.dto";

export type DiscountModel = {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  type: DiscountType;
  scope: DiscountScope;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
};

