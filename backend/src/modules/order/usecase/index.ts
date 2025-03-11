import { Transaction } from 'sequelize';
import { Namespace } from 'socket.io';
import Publisher from 'src/brokers/infras/publisher';
import { QueueTypes } from 'src/brokers/transport/queueTypes';
import { ICartUseCase } from 'src/modules/cart/models/cart.interface';
import { IInventoryUseCase } from 'src/modules/inventory/models/inventory.interface';
import { InventoryInvoiceCreateDTO } from 'src/modules/inventory_invoices/models/inventory_invoices.dto';
import { IInventoryInvoiceUseCase } from 'src/modules/inventory_invoices/models/inventory_invoices.interface';
import { InventoryInvoiceType } from 'src/modules/inventory_invoices/models/inventory_invoices.model';
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
import {
  OrderDetailCreateDTO,
  OrderDetailUpdateDTO,
} from 'src/modules/order_detail/models/order_detail.dto';
import { ORDER_DETAIL_PRODUCT_OUT_OF_STOCK_ERROR } from 'src/modules/order_detail/models/order_detail.error';
import { IOrderDetailUseCase } from 'src/modules/order_detail/models/order_detail.interface';
import { OrderDetail } from 'src/modules/order_detail/models/order_detail.model';
import { PaymentUpdateDTO } from 'src/modules/payment/models/payment.dto';
import { IPaymentUseCase } from 'src/modules/payment/models/payment.interface';
import { productSellableModelName } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { IWarehouseUsecase } from 'src/modules/warehouse/models/warehouse.interface';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';
import { IUserUseCase } from 'src/modules/user/models/user.interface';
import { ListResponse, OrderState } from 'src/share/models/base-model';
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
    private readonly paymentUseCase: IPaymentUseCase,
    private readonly inventoryInvoicesUseCase: IInventoryInvoiceUseCase,
    private readonly productSellableUseCase: IProductSellableUseCase,
    private readonly inventoryUseCase: IInventoryUseCase,
    private readonly warehouseUseCase: IWarehouseUsecase,
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
                warehouse_id: '',
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
      // Create order detail without cart_id
      const orderDetail = await this.orderDetailUseCase.create(
        order_detail_info,
        t
      );
      orderDetailId = orderDetail.id;
      orderDetailCreated = orderDetail;
    }
    // Create new order with PENDING state
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
  async update(
    id: string,
    data: OrderUpdateDTO,
    t?: Transaction
  ): Promise<Order> {
    /**
     * description: Không cho cập nhật DONE
     * order_state: Cho cập nhật (Kiểm tra trạng thái cập nhật để có rules khác nhau) DONE
     * status: Không cho cập nhật
     * adjust_amount: Cho cập nhật
     * adjust_amount_note: Cho cập nhật
     * total: Tính lại total = total hiện tại + điều chỉnh (Không cho cập nhật trực tiếp)
     * paid_amount: Cho cập nhật DONE
     * paid_all_date: Cho cập nhật DONE
     */
    // 1. Get current order detail
    const order = await this.orderRepository.getById(
      id,
      { includeOrderDetail: true, includePayment: true, includeProducts: true },
      t
    );
    const { order_detail_info, inventory_invoice_info, ...orderData } = data;
    // 1. Update order's payment
    const paymentPayload: PaymentUpdateDTO = {
      paid_amount:
        order_detail_info?.payment_info?.paid_amount ||
        order.order_detail?.payment?.paid_amount ||
        0,
      paid_all_date:
        order_detail_info?.payment_info?.paid_all_date ||
        order.order_detail?.payment?.paid_all_date ||
        null,
    };
    await this.paymentUseCase.updatePayment(
      order.order_detail?.payment?.id || '',
      paymentPayload,
      t
    );
    // 2. Update order's order detail
    switch (orderData.order_state) {
      case OrderState.CONFIRMED:
        await this.handleConfirmedOrder(
          order,
          order_detail_info,
          inventory_invoice_info,
          t
        );
        break;
      case OrderState.SHIPPED:
        // await this.handleShippedOrder(orderData);
        break;
      case OrderState.DELIVERED:
        // await this.handleDeliveredOrder(orderData);
        break;
      case OrderState.FAILED:
        // await this.handleFailedOrder(orderData);
        break;
      case OrderState.CANCELLED:
        // await this.handleCancelledOrder(orderData);
        break;
      default:
        break;
    }
    return await this.orderRepository.update(
      id,
      {
        ...orderData,
      },
      t
    );
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderRepository.delete(id);
  }
  private async handleConfirmedOrder(
    order: Order,
    order_detail_info?: OrderDetailUpdateDTO,
    inventory_invoice_info?: InventoryInvoiceCreateDTO,
    t?: Transaction
  ) {
    // Tạo 1 thẻ kho bán hàng
    const orderQuantity =
      order?.order_detail?.product_sellable?.reduce(
        (acc, current) => acc + (current?.product_details?.quantity || 0),
        0
      ) || 0;
    const orderAmount = order?.order_detail?.product_sellable
      ?.map(
        (item) =>
          (item?.inventory?.avg_cost || 0) * item.product_details?.quantity
      )
      .reduce((acc, current) => acc + current, 0);
    const inventoryInvoicePayload: InventoryInvoiceCreateDTO = {
      code: `BH${order.id.substring(0, 5)}` || inventory_invoice_info?.code,
      type: InventoryInvoiceType.SALE_INVOICE,
      note:
        inventory_invoice_info?.note || `Đơn hàng ${order.id} đã được xác nhận`,
      quantity: orderQuantity,
      amount: orderAmount,
    };
    console.log(
      '🚀 ~ OrderUseCase ~ inventoryInvoicePayload:',
      inventoryInvoicePayload
    );
    const inventoryInvoice = await this.inventoryInvoicesUseCase.create(
      inventoryInvoicePayload,
      t
    );
    // Cập nhật lại kho hàng
    const { products_detail } = order_detail_info || {};
    for (const product of products_detail || []) {
      // Get product sellable
      const productSellable = order.order_detail?.product_sellable?.find(
        (item) => item.variant_id == product.id
      );
      const productSellableOrderQuantity = productSellable?.product_details?.quantity || 0;
      const productSellableId = productSellable?.id || '';
      // Get current inventory info by product sellable id
      const productInventory = await this.productSellableUseCase
        .getProductSellableById(productSellableId, {}, t)
        .then((item) => item?.inventory);
      // Get inventory id
      const productInventoryId = productInventory?.id || '';
      // Get warehouse id
      const productWarehouseId = product.warehouse_id || '';
      // Get the cost of that product by inventory id and warehouse id
      const productInventoryByWarehouse =
        await this.inventoryUseCase.getInventoryByInventoryIdAndWarehouseId(
          productInventoryId,
          productWarehouseId,
          t
        );
      // Calculate total quantity, total cost of inventory after order
      const totalInventoryQuantityAfterOrder =
        (productInventory?.total_quantity || 0) - productSellableOrderQuantity;
      const totalInventoryCostAfterOrder =
        (productInventory?.total_cost || 0) -
        productSellableOrderQuantity * productInventoryByWarehouse.cost;
      // Check if sufficient inventory
      if (
        totalInventoryQuantityAfterOrder < 0 ||
        totalInventoryCostAfterOrder < 0
      ) {
        throw ORDER_DETAIL_PRODUCT_OUT_OF_STOCK_ERROR;
      }
      // Update inventory with new total quantity, total cost
      await this.inventoryUseCase.updateInventory(
        productInventoryId,
        {
          total_quantity: totalInventoryQuantityAfterOrder,
          total_cost: totalInventoryCostAfterOrder,
        },
        t
      );
      // Update quantity, cost of inventory in each warehouse after order
      const inventoryWarehouseQuantityAfterOrder =
        productInventoryByWarehouse.quantity - productSellableOrderQuantity;
      const inventoryWarehouseCostAfterOrder =
        productInventoryByWarehouse.total_cost -
        productSellableOrderQuantity * productInventoryByWarehouse.cost;
      // Check if sufficient inventory warehouse
      if (
        inventoryWarehouseQuantityAfterOrder < 0 ||
        inventoryWarehouseCostAfterOrder < 0
      ) {
        throw ORDER_DETAIL_PRODUCT_OUT_OF_STOCK_ERROR;
      }
      await this.inventoryUseCase.updateInventoryWarehouse(
        [
          {
            inventory_id: productInventoryId,
            warehouse_id: productWarehouseId,
            quantity: inventoryWarehouseQuantityAfterOrder,
            total_cost: inventoryWarehouseCostAfterOrder,
          },
        ],
        t
      );
      // Calculate total quantity, total cost of warehouse after order
      const warehouse = await this.warehouseUseCase.getWarehouseById(
        productWarehouseId,
        {},
        t
      );
      const totalWarehouseQuantityAfterOrder =
        warehouse.total_quantity - productSellableOrderQuantity;
      const totalWarehouseCostAfterOrder =
        warehouse.total_cost -
        productSellableOrderQuantity * productInventoryByWarehouse.cost;
      // Check if sufficient warehouse
      if (
        totalWarehouseQuantityAfterOrder < 0 ||
        totalWarehouseCostAfterOrder < 0
      ) {
        throw ORDER_DETAIL_PRODUCT_OUT_OF_STOCK_ERROR;
      }
      // Update warehouse with new total quantity, total cost
      await this.warehouseUseCase.updateWarehouse(
        productWarehouseId,
        {
          total_quantity: totalWarehouseQuantityAfterOrder,
          total_cost: totalWarehouseCostAfterOrder,
        },
        t
      );
    }
  }
  private async handleShippedOrder(order: Order) {}
  private async handleDeliveredOrder(order: Order) {}
  private async handleFailedOrder(order: Order) {
    // Tạo 1 thẻ kho thất bại, hỏi admin có update lại kho hàng hay không
  }
  private async handleCancelledOrder(order: Order) {
    // Tạo 1 thẻ kho huỷ đơn hàng (tính từ lúc confirmed order), không thì khỏi tạo
  }
}
