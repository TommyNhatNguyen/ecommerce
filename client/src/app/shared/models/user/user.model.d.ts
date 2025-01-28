import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role_id: string;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
}
