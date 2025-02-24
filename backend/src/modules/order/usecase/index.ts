import { Transaction } from 'sequelize';
import { Namespace } from 'socket.io';
import { ICartUseCase } from 'src/modules/cart/models/cart.interface';
import {
  OrderConditionDTO,
  OrderCreateDTO,
  OrderUpdateDTO,
} from 'src/modules/order/models/order.dto';
import {
  IOrderRepository,
  IOrderUseCase,
} from 'src/modules/order/models/order.interface';
import { Order } from 'src/modules/order/models/order.model';
import { OrderDetailCreateDTO } from 'src/modules/order_detail/models/order_detail.dto';
import { IOrderDetailUseCase } from 'src/modules/order_detail/models/order_detail.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { SOCKET_NAMESPACE } from 'src/socket/models/socket-endpoint';
import { SocketUseCase } from 'src/socket/usecase';

export class OrderUseCase implements IOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderDetailUseCase: IOrderDetailUseCase,
    private readonly cartUseCase: ICartUseCase,
    private readonly socketIo: SocketUseCase
  ) {}
  async getById(
    id: string,
    condition: OrderConditionDTO,
    t?: Transaction
  ): Promise<Order> {
    if (t) {
      return await this.orderRepository.getById(id, condition, t);
    }
    return await this.orderRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: OrderConditionDTO
  ): Promise<ListResponse<Order[]>> {
    return await this.orderRepository.getList(paging, condition);
  }
  async create(data: Omit<OrderCreateDTO, 'order_detail_id'>): Promise<Order> {
    let orderDetailId: string = '';
    const { order_detail_info, cart_id, ...orderData } = data;
    console.log('🚀 ~ OrderUseCase ~ create ~ data:', data);
    // TODO: create order if has cart_id
    if (cart_id) {
      // 1. Get cart by id
      const cart = await this.cartUseCase.getById(cart_id, {
        include_customer: true,
        include_products: true,
      });
      // 2. Prepare payload
      console.log('🚀 ~ OrderUseCase ~ create ~ cart:', cart);
      const payload: Omit<
        OrderDetailCreateDTO,
        | 'subtotal'
        | 'total_costs'
        | 'total_shipping_fee'
        | 'total_payment_fee'
        | 'total_discount'
        | 'total_order_discount'
        | 'total_product_discount'
        | 'total'
      > = {
        shipping_method_id: order_detail_info.shipping_method_id,
        payment_info: order_detail_info.payment_info,
        customer_id: cart.customer?.id || order_detail_info.customer_id,
        customer_firstName:
          cart.customer?.first_name || order_detail_info.customer_firstName,
        customer_lastName:
          cart.customer?.last_name || order_detail_info.customer_lastName,
        customer_phone:
          cart.customer?.phone || order_detail_info.customer_phone,
        customer_email:
          cart.customer?.email || order_detail_info.customer_email,
        customer_address:
          cart.customer?.address || order_detail_info.customer_address,
        costs_detail: order_detail_info.costs_detail,
        products_detail:
          cart.product_sellable && cart.product_sellable.length > 0
            ? cart.product_sellable?.map((product) => ({
                id: product.id,
                quantity: product.cart_product_sellable?.quantity || 0,
              }))
            : order_detail_info.products_detail,
        order_discounts: order_detail_info.order_discounts,
      };
      // 3. Create order
      const orderDetail = await this.orderDetailUseCase.create(payload);
      // // 4. Create order id
      orderDetailId = orderDetail.id;
      console.log('🚀 ~ OrderUseCase ~ create ~ payload:', payload);
    } else {
      // Create order without cart_id
      const orderDetail = await this.orderDetailUseCase.create(
        order_detail_info
      );
      orderDetailId = orderDetail.id;
    }
    const order = await this.orderRepository.create({
      ...orderData,
      order_detail_id: orderDetailId,
    });
    // Nofify to admin dashboard
    console.log('order created', order);
    this.socketIo.emit(
      SOCKET_NAMESPACE.ORDER.endpoints.ORDER_CREATED,
      JSON.stringify(order)
    );
    // TODO: Save order notification to database
    return order;
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
    console.log(order_detail_info);
    // const orderDetail = await this.orderDetailUseCase.update(id, order_detail_info);
    return await this.orderRepository.update(id, {
      ...orderData,
    });
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderRepository.delete(id);
  }
}
