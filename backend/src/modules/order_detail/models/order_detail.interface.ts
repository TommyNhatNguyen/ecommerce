import { Transaction } from 'sequelize';
import {
  OrderDetailAddCostsDTO,
  OrderDetailAddDiscountsDTO,
  OrderDetailAddProductsDTO,
  OrderDetailConditionDTO,
  OrderDetailCreateDTO,
  OrderDetailUpdateDTO,
} from 'src/modules/order_detail/models/order_detail.dto';
import { OrderDetail } from 'src/modules/order_detail/models/order_detail.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IOrderDetailUseCase {
  getById(id: string, condition: OrderDetailConditionDTO): Promise<OrderDetail>;
  getList(
    paging: PagingDTO,
    condition: OrderDetailConditionDTO
  ): Promise<ListResponse<OrderDetail[]>>;
  create(
    data: Omit<
      OrderDetailCreateDTO,
      | 'subtotal'
      | 'total_costs'
      | 'total_shipping_fee'
      | 'total_payment_fee'
      | 'payment_id'
      | 'total'
      | 'total_discount'
      | 'total_order_discount'
      | 'total_product_discount'
    >
  ): Promise<OrderDetail>;
  update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail>;
  delete(id: string): Promise<boolean>;
}

export interface IOrderDetailRepository
  extends IQueryRepository,
    ICommandRepository {
  addProducts(data: OrderDetailAddProductsDTO[], t: Transaction): Promise<boolean>;
  addDiscounts(data: OrderDetailAddDiscountsDTO[], t: Transaction): Promise<boolean>;
  addCosts(data: OrderDetailAddCostsDTO[], t: Transaction): Promise<boolean>;
}

export interface IQueryRepository {
  getById(id: string, condition: OrderDetailConditionDTO): Promise<OrderDetail>;
  getList(
    paging: PagingDTO,
    condition: OrderDetailConditionDTO
  ): Promise<ListResponse<OrderDetail[]>>;
}

export interface ICommandRepository {
  create(
    data: Omit<
      OrderDetailCreateDTO,
      'products_detail' | 'payment_info' | 'costs_detail' | 'order_discounts'
    >,
    t: Transaction
  ): Promise<OrderDetail>;
  update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail>;
  delete(id: string): Promise<boolean>;
}
