export type CreateDiscountDTO = {
  name: string;
  description?: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  product_ids?: string[];
};

export type UpdateDiscountDTO = {
  name?: string;
  description?: string;
  discount_percentage?: number;
  start_date?: Date;
  end_date?: Date;
  status?: ModelStatus;
};