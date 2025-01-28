import { ModelStatus } from "@/app/shared/models/others/status.model";
import { Role } from "@/app/shared/models/role/role.model";

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role_id: string;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  role?: Partial<Role>;
}
