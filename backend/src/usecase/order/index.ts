import {
  OrderConditionDTO,
  OrderCreateDTO,
  OrderUpdateDTO,
} from '@models/order/order.dto';
import { IOrderRepository, IOrderUseCase } from '@models/order/order.interface';
import { Order } from '@models/order/order.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class OrderUseCase implements IOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}
  async getById(id: string, condition: OrderConditionDTO): Promise<Order> {
    return await this.orderRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>> {
    return await this.orderRepository.getList(paging, condition);
  }
  async create(data: OrderCreateDTO): Promise<Order> {
    return await this.orderRepository.create(data);
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    return await this.orderRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderRepository.delete(id);
  }
}
