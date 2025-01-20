import { Namespace } from 'socket.io';
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
    private readonly orderDetailUseCase: IOrderDetailUseCase,
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
    return await this.orderRepository.create({
      ...orderData,
      order_detail_id: orderDetail.id,
    });
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    /**
     * description check
     * order_state check
     * status check
     * order_detail_info
     */
    /** order_detail_info
     *  subtotal
     *  total_shipping_fee
     *  total_payment_fee
     *  total_costs
     *  total_discount
     *  total
     * ---------
     * Products
     *  product_id
     *  quantity
     *  price
     *  subtotal
     *  discount_amount
     * ---------
     * Shipping
     *  shipping_id
     * ------------
     * Payment
     *  payment_id
     * ------------
     * Customer
     *  customer_id
     *  customer_name
     *  customer_phone
     *  customer_email
     *  customer_address
     */
    const { order_detail_info, ...orderData } = data;
    // const orderDetail = await this.orderDetailUseCase.update(id, order_detail_info);
    return await this.orderRepository.update(id, {
      ...orderData,
    });
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderRepository.delete(id);
  }
}
