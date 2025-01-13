import { ICustomerRepository } from '@models/customer/customer.interface';
import { Customer } from '@models/customer/customer.model';
import {
  OrderConditionDTO,
  OrderCreateDTO,
  OrderUpdateDTO,
} from '@models/order/order.dto';
import { IOrderRepository, IOrderUseCase } from '@models/order/order.interface';
import { Order } from '@models/order/order.model';
import { IProductRepository } from '@models/product/product.interface';
import { Product } from '@models/product/product.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class OrderUseCase implements IOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly customerRepository: ICustomerRepository
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
  async create(data: Omit<OrderCreateDTO, 'total_price'>): Promise<Order> {
    const { product_orders, customer_id, customer_name, shipping_phone, ...rest } = data;
    const productFoundList: Product[] = [];
    // Check if customer exists
    let customer : Customer | null = null;
    if (!customer_id) {
      customer = await this.customerRepository.createCustomer({
        phone: data.shipping_phone,
        last_name: data.customer_name,
      })
    } else {
      customer = await this.customerRepository.getCustomerById(customer_id);
    }
    // Check if product exists
    for (const item of product_orders) {
      const { product_id } = item;
      const productFound = await this.productRepository.get(product_id, {
        includeDiscount: true,
      });
      if (!productFound) {
        return null as any;
      } else {
        productFoundList.push(productFound);
      }
    }
    const payload: OrderCreateDTO = {
      customer_id: customer_id ? customer_id : customer.id,
      customer_name: customer_name ? customer_name : customer.last_name,
      shipping_phone: shipping_phone ? shipping_phone : customer.phone,
      ...rest,
      total_price: productFoundList.reduce(
        (acc, item, index) => acc + item.price * product_orders[index].quantity,
        0
      ),
      product_orders: product_orders.map((product, index) => ({
        ...product,
        subtotal: productFoundList[index].price * product.quantity,
      })),
    };
    return await this.orderRepository.create(payload);
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    return await this.orderRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderRepository.delete(id);
  }
}
