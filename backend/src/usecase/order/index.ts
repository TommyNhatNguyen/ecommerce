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
    private readonly productRepository: IProductRepository
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
  async create(data: OrderCreateDTO): Promise<Order> {
    const { product_orders, total_price, ...rest } = data;
    const productFoundList: Product[] = [];
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
    // Check if each product has correct subtotal
    for (const item of product_orders) {
      const { product_id, quantity, subtotal } = item;
      const productFound = productFoundList.find(
        (product) => product.id === product_id
      );
      if (productFound!.price * quantity !== subtotal) {
        return null as any;
      }
    }
    // Check if total price is correct
    const totalPriceInput = product_orders.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );
    if (totalPriceInput !== total_price) {
      return null as any;
    }
    return await this.orderRepository.create(data);
  }
  async update(id: string, data: OrderUpdateDTO): Promise<Order> {
    return await this.orderRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderRepository.delete(id);
  }
}
