
import { DiscountConditionDTOSchema, DiscountCreateDTOSchema, DiscountUpdateDTOSchema } from "@models/discount/discount.dto";
import { Discount } from "@models/discount/discount.model";

import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export interface IDiscountUseCase {
  listDiscount(paging: PagingDTO, condition: DiscountConditionDTOSchema): Promise<ListResponse<Discount[]>>;
  getDiscount(id: string): Promise<Discount | null>;
  createDiscount(data: DiscountCreateDTOSchema): Promise<Discount>;
  updateDiscount(id: string, data: DiscountUpdateDTOSchema): Promise<Discount>;
  deleteDiscount(id: string): Promise<boolean>;
}

export interface IDiscountRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  list(
    paging: PagingDTO,
    condition: DiscountConditionDTOSchema
  ): Promise<ListResponse<Discount[]>>;
  get(id: string): Promise<Discount | null>;
}

export interface ICommandRepository {
  insert(data: DiscountCreateDTOSchema): Promise<Discount>;
  update(id: string, data: DiscountUpdateDTOSchema): Promise<Discount>;
  delete(id: string): Promise<boolean>;
}
