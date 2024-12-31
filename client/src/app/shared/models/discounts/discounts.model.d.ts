export type DiscountModel = {
  id: string;
  name: string;
  description: string | null;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
};

