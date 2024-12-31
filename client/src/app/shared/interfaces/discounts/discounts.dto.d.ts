export type CreateDiscountDTO = {
  name: string;
  description?: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  product_ids?: string[];
};
