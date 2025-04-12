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
  is_get_all?: boolean;
  include_role?: boolean;
  include_permission?: boolean;
  include_image?: boolean;
}

export interface ICreateUserDTO {
  username: string;
  password: string;
  phone: string;
  email?: string;
  role_id: string;
  image_id?: string;
}
