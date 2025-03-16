import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface BrandModel {
  id: string;
  name: string;
  description: string;
  product_id: string | null;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
}
