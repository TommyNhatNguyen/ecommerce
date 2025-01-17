export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum DiscountScope {
  PRODUCT = 'product',
  ORDER = 'order',
}

export type CreateDiscountDTO = {
  name: string;
  description?: string;
  amount: number;
  type: DiscountType;
  scope: DiscountScope;
  start_date: string;
  end_date: string;
};

export type UpdateDiscountDTO = {
  name?: string;
  description?: string;
  amount?: number;
  type?: DiscountType;
  scope?: DiscountScope;
  start_date?: Date;
  end_date?: Date;
  status?: ModelStatus;
};