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
  PRICE = 'price',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}
