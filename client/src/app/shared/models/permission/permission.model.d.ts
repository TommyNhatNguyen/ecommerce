import { ModelStatus } from "@/app/shared/models/others/status.model";

export interface RoleWithPermissions {
  permission_id: string,
  role_id: string,
  allow_create: boolean,
  allow_read: boolean,
  allow_update: boolean,
  allow_delete: boolean,
  created_at: string,
  updated_at: string,
  status: ModelStatus,
}

export enum ResourcesType {
  CATEGORY = 'CATEGORY',
  CUSTOMER = 'CUSTOMER',
  DISCOUNT = 'DISCOUNT',
  IMAGE = 'IMAGE',
  INVENTORY = 'INVENTORY',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  PERMISSION = 'PERMISSION',
  PRODUCT = 'PRODUCT',
  REVIEW = 'REVIEW',
  ROLE = 'ROLE',
  SHIPPING = 'SHIPPING',
  USER = 'USER',
  VARIANT = 'VARIANT',
}

export interface Permission {
  id: string,
  type: ResourcesType,
  status: ModelStatus,
  created_at: string,
  updated_at: string,
  permission_role?: Partial<RoleWithPermissions>[],  
}
