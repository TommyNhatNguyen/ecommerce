import { Transaction } from 'sequelize';
import { Namespace } from 'socket.io';
import Publisher from 'src/brokers/infras/publisher';
import { QueueTypes } from 'src/brokers/transport/queueTypes';
import { ICartUseCase } from 'src/modules/cart/models/cart.interface';
import { ActorType } from 'src/modules/messages/actor/models/actor.model';
import { EntityKind } from 'src/modules/messages/entity/models/entity.model';
import { IMessageUseCase } from 'src/modules/messages/models/message.interface';
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
import { OrderDetail } from 'src/modules/order_detail/models/order_detail.model';
import { productSellableModelName } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { IUserUseCase } from 'src/modules/user/models/user.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { SOCKET_NAMESPACE } from 'src/socket/models/socket-endpoint';
import { SocketUseCase } from 'src/socket/usecase';

export class OrderUseCase implements IOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderDetailUseCase: IOrderDetailUseCase,
    private readonly cartUseCase: ICartUseCase,
    private readonly messageUsecase: IMessageUseCase,
    private readonly userUseCase: IUserUseCase,
    private readonly orderAlertPublisher: Publisher
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
  async create(
    data: Omit<OrderCreateDTO, 'order_detail_id'>,
    t?: Transaction
  ): Promise<Order> {
    let orderDetailId: string = '';
    let orderDetailCreated: OrderDetail;
    const { order_detail_info, cart_id, actor, ...orderData } = data;
    // TODO: create order if has cart_id
    if (cart_id) {
      // 1. Get cart by id
      const cart = await this.cartUseCase.getById(
        cart_id,
        {
          include_customer: true,
          include_products: true,
        },
        t
      );
      // 2. Prepare payload
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
      const orderDetail = await this.orderDetailUseCase.create(payload, t);
      orderDetailCreated = orderDetail;
      // // 4. Create order id
      orderDetailId = orderDetail.id;
      // 5 Reset cart
      await this.cartUseCase.update(
        cart_id,
        {
          product_quantity: 0,
          product_count: 0,
          subtotal: 0,
          total_discount: 0,
          total: 0,
          updated_at: new Date().toISOString(),
          [productSellableModelName]: [],
        },
        t
      );
    } else {
      // Create order without cart_id
      const orderDetail = await this.orderDetailUseCase.create(
        order_detail_info,
        t
      );
      orderDetailId = orderDetail.id;
      orderDetailCreated = orderDetail;
    }
    const order = await this.orderRepository.create(
      {
        ...orderData,
        order_detail_id: orderDetailId,
      },
      t
    );
    // Nofify to admin dashboard
    const notificationPayload = {
      ...order,
      order_detail: orderDetailCreated,
    };
    this.orderAlertPublisher.publishMessage(QueueTypes.ORDER_NOTIFICATION, {
      from: 'order',
      message: notificationPayload,
    });
    // Save order notification to database
    let actor_info_id = orderDetailCreated.customer_id || '';
    let actor_type = ActorType.CUSTOMER;
    console.log(
      '🚀 ~ OrderUseCase ~ actor_info_id:',
      actor_info_id,
      actor_type
    );
    if (actor !== 'customer') {
      const user = await this.userUseCase.getUserByUsername(actor || '', {}, t);
      if (user) {
        actor_info_id = user.id;
        actor_type = ActorType.ADMIN;
      }
    }
    const message = await this.messageUsecase.createMessage(
      {
        entity_info: {
          type: 'order',
          kind: EntityKind.CREATE,
        },
        actor_info_id,
        actor_type,
      },
      t
    );
    console.log('🚀 ~ OrderUseCase ~ message:', message);
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
    // const orderDetail = await this.orderDetailUseCase.update(id, order_detail_info);
    return await this.orderRepository.update(id, {
      ...orderData,
    });
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderRepository.delete(id);
  }
}
