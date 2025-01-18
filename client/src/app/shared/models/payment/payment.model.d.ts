export interface PaymentModel {
  id: string;
  payment_method_id: string;
  paid_amount: number;
  paid_all_date: string | null;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  payment_method?: PaymentMethodModel;
}

export interface PaymentMethodModel {
  id: string;
  status: ModelStatus;
  type: string;
  cost: number;
}
