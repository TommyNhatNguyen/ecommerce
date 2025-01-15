import { Meta } from "src/share/models/paging";

export enum ModelStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export interface ListResponse<T> {
  data: T;
  meta: Meta;
}

export enum BaseOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum BaseSortBy {
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum OrderState {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
  EXPIRED = 'EXPIRED',
  CANCELLED_BY_ADMIN = 'CANCELLED_BY_ADMIN',
}

export enum NumberType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum ShippingMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  SAME_DAY = 'SAME_DAY',
  NEXT_DAY = 'NEXT_DAY',
  OTHER = 'OTHER',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  COD = 'COD',
  PAYMENT_GATEWAY = 'PAYMENT_GATEWAY',
  WALLET = 'WALLET',
  OTHER = 'OTHER',
}

export enum Roles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER = 'USER',
}

export enum PermissionType {
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
