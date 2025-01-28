import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface IUserConditionDTO {
  id?: string;
  username?: string;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
  phone?: string;
  email?: string;
  role_id?: string;
  include_role?: boolean;
  include_permission?: boolean;
}