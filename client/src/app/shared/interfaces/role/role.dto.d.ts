export interface RoleListConditionDTO {
  id?: string;
  name?: string;
  status?: ModelStatus;
  created_at?: Date;
  updated_at?: Date;
  is_get_all?: boolean;
  include_permissions?: boolean;
  include_users?: boolean;
  page?: number;
  limit?: number;
}

export interface RoleCreateDTO {
  name: string;
}