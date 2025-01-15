import {
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
  create(data: Omit<OrderDetailCreateDTO, 'subtotal' | 'total_costs'>): Promise<OrderDetail>;
  update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail>;
  delete(id: string): Promise<boolean>;
}

export interface IOrderDetailRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  getById(id: string, condition: OrderDetailConditionDTO): Promise<OrderDetail>;
  getList(
    paging: PagingDTO,
    condition: OrderDetailConditionDTO
  ): Promise<ListResponse<OrderDetail[]>>;
}

export interface ICommandRepository {
  create(
    data: Omit<OrderDetailCreateDTO, 'products_detail'>
  ): Promise<OrderDetail>;
  update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail>;
  delete(id: string): Promise<boolean>;
}
