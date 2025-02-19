import {
  DiscountConditionDTO,
  DiscountCreateDTO,
  DiscountUpdateDTO,
} from 'src/modules/discount/models/discount.dto';
import { Discount } from 'src/modules/discount/models/discount.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IDiscountUseCase {
  listDiscount(
    paging: PagingDTO,
    condition: DiscountConditionDTO
  ): Promise<ListResponse<Discount[]>>;
  getDiscount(id: string): Promise<Discount | null>;
  createDiscount(
    data: Omit<
      DiscountCreateDTO,
      | 'has_max_discount_count'
      | 'is_require_product_count'
      | 'is_require_order_amount'
    >
  ): Promise<Discount>;
  updateDiscount(id: string, data: DiscountUpdateDTO): Promise<Discount>;
  deleteDiscount(id: string): Promise<boolean>;
}

export interface IDiscountRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  list(
    paging: PagingDTO,
    condition: DiscountConditionDTO
  ): Promise<ListResponse<Discount[]>>;
  get(id: string): Promise<Discount | null>;
}

export interface ICommandRepository {
  insert(data: DiscountCreateDTO): Promise<Discount>;
  update(id: string, data: DiscountUpdateDTO): Promise<Discount>;
  delete(id: string): Promise<boolean>;
}
