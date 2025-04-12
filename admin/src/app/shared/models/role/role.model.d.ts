import { Permission } from "@/app/shared/models/permission/permission.model";
import { User } from "@/app/shared/models/user/user.model";

export interface Role {
  id: string;
  name: string;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  permission?: Partial<Permission>[];
  user?: Partial<User>[];
}
