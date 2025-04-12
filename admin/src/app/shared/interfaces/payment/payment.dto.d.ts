import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface PaymentMethodConditionDTO {
  type?: string;
  minCost?: number;
  maxCost?: number;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
  limit?: number;
  page?: number;
}

export interface CreatePaymentMethodDTO {
  type: string;
  cost: number;
  status?: ModelStatus;
}