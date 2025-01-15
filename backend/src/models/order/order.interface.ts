import {
  OrderConditionDTO,
  OrderCreateDTO,
  OrderUpdateDTO,
} from '@models/order/order.dto';
import { Order } from '@models/order/order.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IOrderUseCase {
  getById(id: string, condition: OrderConditionDTO): Promise<Order>;
  getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>>;
  create(
    data: Omit<OrderCreateDTO, 'total_price' | 'customer_id'>
  ): Promise<Order>;
  update(id: string, data: OrderUpdateDTO): Promise<Order>;
  delete(id: string): Promise<boolean>;
}

export interface IOrderRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  getById(id: string, condition: OrderConditionDTO): Promise<Order>;
  getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>>;
}

export interface ICommandRepository {
  create(data: OrderCreateDTO): Promise<Order>;
  update(id: string, data: OrderUpdateDTO): Promise<Order>;
  delete(id: string): Promise<boolean>;
}
