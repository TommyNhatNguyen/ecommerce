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
import {
  ORDER_DETAIL_ERROR,
  ORDER_DETAIL_PRODUCT_ERROR,
} from 'src/modules/order_detail/models/order_detail.error';
import { IShippingUseCase } from 'src/modules/shipping/models/shipping.interface';
import { IPaymentUseCase } from 'src/modules/payment/models/payment.interface';
import { IProductUseCase } from '@models/product/product.interface';
import { IPaymentMethodUseCase } from 'src/modules/payment_method/models/payment_method.interface';
import { ICostUseCase } from 'src/modules/cost/models/cost.interface';

export class OrderDetailUseCase implements IOrderDetailUseCase {
  constructor(
    private readonly orderDetailRepository: IOrderDetailRepository,
    private readonly customerUseCase: ICustomerUseCase,
    private readonly productUseCase: IProductUseCase,
    private readonly shippingUseCase: IShippingUseCase,
    private readonly paymentUseCase: IPaymentUseCase,
    private readonly paymentMethodUseCase: IPaymentMethodUseCase,
    private readonly costUseCase: ICostUseCase
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
    const { products_detail, customer_id, payment_info,costs_detail, ...rest } = data;

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

    if (costs_detail && costs_detail.length > 0) {
      const costs = await this.costUseCase.getList(
        { page: 1, limit: costs_detail.length },
        {
          ids: costs_detail.map((cost) => cost.id),
        }
      );
      if (costs.data.length !== costs_detail.length)
        throw ORDER_DETAIL_ERROR;
      payload.total_costs = costs.data.reduce((acc, cost) => {
        return acc + cost.cost;
      }, 0);
    }

    if (payment_info?.payment_method_id) {
      const paymentMethod = await this.paymentMethodUseCase.getById(
        payment_info?.payment_method_id
      );
      if (!paymentMethod) throw ORDER_DETAIL_ERROR;
      payload.total_payment_fee = paymentMethod?.cost ?? 0;
      payload.total =
        payload.subtotal -
        (payload.total_shipping_fee +
          payload.total_payment_fee +
          payload.total_costs);
      const payment = await this.paymentUseCase.createPayment({
        paid_amount: payment_info?.paid_amount ?? 0,
        payment_method_id: payment_info?.payment_method_id,
        paid_all_date:
          payment_info?.paid_amount === payload.total
            ? new Date()
            : null,
      });
      payload.payment_id = payment.id;
    }
    console.log(payload);
    return await this.orderDetailRepository.create(payload);
  }
  async update(id: string, data: OrderDetailUpdateDTO): Promise<OrderDetail> {
    return await this.orderDetailRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.orderDetailRepository.delete(id);
  }
}
