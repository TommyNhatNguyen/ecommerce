import { NumberType } from "@/app/shared/models/others/number-type.model";

export interface CostConditionDTO {
  type?: NumberType;
  name?: string;
  cost?: number;
  description?: string;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  limit?: number;
  page?: number;
  ids?: string[];
}
