
import { Transaction } from 'sequelize';
import { OrderConditionDTO, OrderUpdateDTO } from 'src/modules/order/models/order.dto';
import { OrderCreateDTO } from 'src/modules/order/models/order.dto';
import { Order } from 'src/modules/order/models/order.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IOrderUseCase {
  getById(id: string, condition: OrderConditionDTO, t?: Transaction): Promise<Order>;
  getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>>;
  create(
    data: Omit<OrderCreateDTO, 'total_price' | 'customer_id' | 'order_detail_id'>, t?:Transaction
  ): Promise<Order>;
  update(id: string, data: OrderUpdateDTO, t?: Transaction): Promise<Order>;
  delete(id: string): Promise<boolean>;
}

export interface IOrderRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  getById(id: string, condition: OrderConditionDTO, t?: Transaction): Promise<Order>;
  getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>>;
}

export interface ICommandRepository {
  create(data:Omit<OrderCreateDTO, 'order_detail_info'>, t?:Transaction): Promise<Order>;
  update(id: string, data: OrderUpdateDTO, t?: Transaction): Promise<Order>;
  delete(id: string): Promise<boolean>;
}
