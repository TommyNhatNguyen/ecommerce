import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { IOrderDetailRepository } from 'src/modules/order_detail/models/order_detail.interface';
import {
  OrderDetailConditionDTO,
  OrderDetailCreateDTO,
  OrderDetailUpdateDTO,
} from 'src/modules/order_detail/models/order_detail.dto';
import { IOrderDetailUseCase } from 'src/modules/order_detail/models/order_detail.interface';
import { OrderDetail } from 'src/modules/order_detail/models/order_detail.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { ICustomerUseCase } from 'src/modules/customer/models/customer.interface';
import { ORDER_DETAIL_ERROR, ORDER_DETAIL_PRODUCT_ERROR } from 'src/modules/order_detail/models/order_detail.error';
import { IShippingUseCase } from 'src/modules/shipping/models/shipping.interface';
import { IPaymentUseCase } from 'src/modules/payment/models/payment.interface';
import { IProductUseCase } from '@models/product/product.interface';

export class OrderDetailUseCase implements IOrderDetailUseCase {
  constructor(
    private readonly orderDetailRepository: IOrderDetailRepository,
    private readonly customerUseCase: ICustomerUseCase, 
    private readonly productUseCase: IProductUseCase,
    private readonly shippingUseCase: IShippingUseCase,
    private readonly paymentUseCase: IPaymentUseCase
  ) {}
  async getById(
    id: string,
    condition: OrderDetailConditionDTO
  ): Promise<OrderDetail> {
    return await this.orderDetailRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: OrderDetailConditionDTO
  ): Promise<ListResponse<OrderDetail[]>> {
    return await this.orderDetailRepository.getList(paging, condition);
  }
  async create(data: OrderDetailCreateDTO): Promise<OrderDetail> {
    const { products_detail, customer_id, ...rest } = data;

    const payload = {
      ...rest,
      customer_id: customer_id || '',
    };
    if (!customer_id) {
      const newCustomer = await this.customerUseCase.createCustomer({
        last_name: rest.customer_name,
        phone: rest.customer_phone,
        address: rest.customer_address,
        email: rest.customer_email,
      });
      if (newCustomer) {
        payload.customer_id = newCustomer.id;
      }
    }
    if (products_detail.length > 0) {
      const productIds = products_detail.map((product) => product.id);
      const products = await this.productUseCase.getProducts(
        {
          ids: productIds,
        },
        { page: 1, limit: products_detail.length }
      );
      if (products.data.length !== products_detail.length)
        throw ORDER_DETAIL_PRODUCT_ERROR;
      console.log(products);
      payload.subtotal = products.data.reduce((acc, product) => {
        const productDetail = products_detail.find((p) => p.id === product.id);
        if (!productDetail) throw ORDER_DETAIL_PRODUCT_ERROR;
        return acc + product.price * (productDetail?.quantity ?? 0);
      }, 0);
    } else {
      throw ORDER_DETAIL_ERROR;
    }
    if (payload.shipping_method_id) {
        const shipping = await this.shippingUseCase.getShippingById(
          payload.shipping_method_id
        );
      payload.total_shipping_fee = shipping?.cost ?? 0;
    }

    //    "subtotal": 100,
    // "total_shipping_fee": 10,
    // "total_payment_fee": 10,
    // "total_costs": 0,
    // "total": 1000,
    payload.total =
      payload.subtotal -
      (payload.total_shipping_fee +
        payload.total_costs);
    return await this.orderDetailRepository.create(payload);
  }
  async update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail> {
    return await this.orderDetailRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderDetailRepository.delete(id);
  }
}
