import { ModelStatus } from "../others/status.model";

export type VariantModel = {
  id: string;
  type: string;
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
  status: ModelStatus;
};
