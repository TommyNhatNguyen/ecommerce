export interface PermissionConditionDTO {
  id?: string;
  type?: ResourcesType;
  status?: ModelStatus;
  created_at?: string;
  updated_at?: string;
  order?: BaseOrder;
  sortBy?: BaseSortBy;
  include_role?: boolean;
  is_get_all?: boolean;
  page?: number;
  limit?: number;
}

export interface PermissionUpdateDTO {
  role_id: string;
  permission_id: string;
  allow_create: boolean;
  allow_read: boolean;
  allow_update: boolean;
  allow_delete: boolean;
}