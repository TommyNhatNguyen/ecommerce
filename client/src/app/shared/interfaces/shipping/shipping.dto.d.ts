import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface ShippingConditionDTO {
  type?: string;
  minCost?: number;
  maxCost?: number;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
  page?: number;
  limit?: number;
}
