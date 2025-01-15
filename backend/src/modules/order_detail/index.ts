import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import {
  orderDetailInit,
  orderDetailModelName,
  orderDetailProductInit,
} from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { PostgresOrderDetailRepository } from 'src/modules/order_detail/infras/repo/postgres/order_detail.repo';
import { OrderDetailHttpService } from 'src/modules/order_detail/infras/transport/order_detail.http-service';
import { OrderDetailUseCase } from 'src/modules/order_detail/usecase';
import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { CustomerUseCase } from 'src/modules/customer/usecase';
import { cartModelName } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { PostgresCartRepository } from 'src/modules/cart/infras/repo/postgres/cart.repo';
import { PostgresProductRepository } from 'src/infras/repository/product/repo';
import { productModelName } from 'src/infras/repository/product/dto';
import { ProductUseCase } from 'src/usecase/product';
import { ShippingUseCase } from 'src/modules/shipping/usecase';
import { shippingModelName } from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import { PostgresPaymentRepository } from 'src/modules/payment/infras/repo/postgres/payment.repo';
import { paymentModelName } from 'src/modules/payment/infras/repo/postgres/payment.dto';
import { PaymentUseCase } from 'src/modules/payment/usecase';
import { PostgresShippingRepository } from 'src/modules/shipping/infras/postgres/repo/shipping.repo';
import { paymentMethodModelName } from 'src/modules/payment_method/infras/postgres/repo/payment_method.dto';
import { PostgresPaymentMethodRepository } from 'src/modules/payment_method/infras/postgres/repo/payment_method.repo';
import { PaymentMethodUseCase } from 'src/modules/payment_method/usecase';
import { CostUseCase } from 'src/modules/cost/usecase';
import { costModelName } from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { PostgresCostRepository } from 'src/modules/cost/infras/repo/postgres/cost.repo';
export function setupOrderDetailRouter(sequelize: Sequelize) {
  orderDetailInit(sequelize);
  orderDetailProductInit(sequelize);
  const router = Router();
  const orderDetailRepository = new PostgresOrderDetailRepository(
    sequelize,
    orderDetailModelName
  );
  const customerRepository = new PostgresCustomerRepository(
    sequelize,
    customerModelName
  );
  const cartRepository = new PostgresCartRepository(sequelize, cartModelName);
  const productRepository = new PostgresProductRepository(
    sequelize,
    productModelName
  );
  const shippingRepository = new PostgresShippingRepository(
    sequelize,
    shippingModelName
  );
  const paymentRepository = new PostgresPaymentRepository(
    sequelize,
    paymentModelName
  );
  const paymentMethodRepository = new PostgresPaymentMethodRepository(
    sequelize,
    paymentMethodModelName
  );
  const costRepository = new PostgresCostRepository(sequelize, costModelName);
  const productUseCase = new ProductUseCase(
    productRepository,
    orderDetailRepository
  );
  const customerUseCase = new CustomerUseCase(
    customerRepository,
    cartRepository
  );
  const costUseCase = new CostUseCase(costRepository);
  const shippingUseCase = new ShippingUseCase(shippingRepository);
  const paymentUseCase = new PaymentUseCase(paymentRepository);
  const paymentMethodUseCase = new PaymentMethodUseCase(
    paymentMethodRepository
  );
  const orderDetailUseCase = new OrderDetailUseCase(
    orderDetailRepository,
    customerUseCase,
    productUseCase,
    shippingUseCase,
    paymentUseCase,
    paymentMethodUseCase,
    costUseCase
  );
  const orderDetailHttpService = new OrderDetailHttpService(orderDetailUseCase);
  router.get(
    '/order-detail/:id',
    orderDetailHttpService.getById.bind(orderDetailHttpService)
  );
  router.get(
    '/order-detail',
    orderDetailHttpService.getList.bind(orderDetailHttpService)
  );
  router.post(
    '/order-detail',
    orderDetailHttpService.create.bind(orderDetailHttpService)
  );
  router.put(
    '/order-detail/:id',
    orderDetailHttpService.update.bind(orderDetailHttpService)
  );
  router.delete(
    '/order-detail/:id',
    orderDetailHttpService.delete.bind(orderDetailHttpService)
  );
  return router;
}
