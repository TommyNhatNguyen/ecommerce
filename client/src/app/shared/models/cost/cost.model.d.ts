import { NumberType } from "@/app/shared/models/others/number-type.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface CostModel {
  id: string;
  type: NumberType;
  name: string;
  cost: number;
  description: string;
  status: ModelStatus;
}

