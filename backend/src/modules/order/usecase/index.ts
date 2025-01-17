import {
  OrderConditionDTO,
  OrderCreateDTO,
  OrderUpdateDTO,
} from 'src/modules/order/models/order.dto';
import { IOrderRepository, IOrderUseCase } from 'src/modules/order/models/order.interface';
import { Order } from 'src/modules/order/models/order.model';
import { IOrderDetailUseCase } from 'src/modules/order_detail/models/order_detail.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class OrderUseCase implements IOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderDetailUseCase: IOrderDetailUseCase
  ) {}
  async getById(id: string, condition: OrderConditionDTO): Promise<Order> {
    return await this.orderRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>> {
    return await this.orderRepository.getList(paging, condition);
  }
  async create(data: Omit<OrderCreateDTO, 'order_detail_id'>): Promise<Order> {
    const { order_detail_info, ...orderData } = data;
    const orderDetail = await this.orderDetailUseCase.create(order_detail_info);
    console.log(orderDetail);
    return await this.orderRepository.create({
      ...orderData,
      order_detail_id: orderDetail.id,
    });
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    return await this.orderRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderRepository.delete(id);
  }
}
