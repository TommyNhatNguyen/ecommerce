import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  orderInit,
  orderModelName,
} from 'src/modules/order/infras/repo/postgres/dto';
import { PostgresOrderRepository } from 'src/modules/order/infras/repo/postgres/repo';
import { OrderUseCase } from 'src/modules/order/usecase';
import { OrderHttpService } from 'src/modules/order/infras/transport/order-http.service';
import {
  orderDetailCostModelName,
  orderDetailDiscountModelName,
  orderDetailModelName,
  orderDetailProductModelName,
} from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { PostgresOrderDetailRepository } from 'src/modules/order_detail/infras/repo/postgres/order_detail.repo';
import { OrderDetailUseCase } from 'src/modules/order_detail/usecase';
import { CostUseCase } from 'src/modules/cost/usecase';
import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { PostgresCartRepository } from 'src/modules/cart/infras/repo/postgres/cart.repo';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { PostgresProductRepository } from 'src/modules/products/infras/repo/postgres/repo';
import { cartModelName } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { PostgresShippingRepository } from 'src/modules/shipping/infras/postgres/repo/shipping.repo';
import {
  productCategoryModelName,
  productDiscountModelName,
  productModelName,
} from 'src/modules/products/infras/repo/postgres/dto';
import { PostgresPaymentRepository } from 'src/modules/payment/infras/repo/postgres/payment.repo';
import { paymentMethodModelName } from 'src/modules/payment_method/infras/postgres/repo/payment_method.dto';
import { shippingModelName } from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import { paymentModelName } from 'src/modules/payment/infras/repo/postgres/payment.dto';
import { PostgresPaymentMethodRepository } from 'src/modules/payment_method/infras/postgres/repo/payment_method.repo';
import { PostgresCostRepository } from 'src/modules/cost/infras/repo/postgres/cost.repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { CloudinaryImageRepository } from 'src/infras/repository/image/repo';
import cloudinary from 'src/share/cloudinary';
import { costModelName } from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { ProductUseCase } from 'src/modules/products/usecase';
import { CustomerUseCase } from 'src/modules/customer/usecase';
import { ShippingUseCase } from 'src/modules/shipping/usecase';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { PaymentUseCase } from 'src/modules/payment/usecase';
import { PaymentMethodUseCase } from 'src/modules/payment_method/usecase';

export function setupOrderRouter(sequelize: Sequelize) {
  orderInit(sequelize);
  const router = Router();
  const orderRepository = new PostgresOrderRepository(
    sequelize,
    orderModelName
  );
  const orderDetailRepository = new PostgresOrderDetailRepository(
    sequelize,
    orderDetailModelName
  );
  const orderDetailProductRepository = new PostgresOrderDetailRepository(
    sequelize,
    orderDetailProductModelName
  );
  const orderDetailDiscountRepository = new PostgresOrderDetailRepository(
    sequelize,
    orderDetailDiscountModelName
  );
  const orderDetailCostRepository = new PostgresOrderDetailRepository(
    sequelize,
    orderDetailCostModelName
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
  const discountRepository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
  );
  const cloudinaryRepository = new CloudinaryImageRepository(cloudinary);
  const productCategoryRepository = new PostgresProductRepository(
    sequelize,
    productCategoryModelName
  );
  const productDiscountRepository = new PostgresProductRepository(
    sequelize,
    productDiscountModelName
  );
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const inventoryUseCase = new InventoryUseCase(inventoryRepository);
  const productUseCase = new ProductUseCase(
    productRepository,
    cloudinaryRepository,
    productCategoryRepository,
    productDiscountRepository,
    inventoryUseCase
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
  const discountUseCase = new DiscountUseCase(discountRepository);
  const orderDetailUseCase = new OrderDetailUseCase(
    orderDetailRepository,
    orderDetailProductRepository,
    orderDetailDiscountRepository,
    orderDetailCostRepository,
    customerUseCase,
    productUseCase,
    shippingUseCase,
    paymentUseCase,
    paymentMethodUseCase,
    costUseCase,
    discountUseCase
  );
  const orderUseCase = new OrderUseCase(orderRepository, orderDetailUseCase);
  const orderHttpService = new OrderHttpService(orderUseCase);
  router.get('/order/:id', orderHttpService.getById.bind(orderHttpService));
  router.get('/order', orderHttpService.getList.bind(orderHttpService));
  router.post('/order', orderHttpService.create.bind(orderHttpService));
  router.put('/order/:id', orderHttpService.update.bind(orderHttpService));
  router.delete('/order/:id', orderHttpService.delete.bind(orderHttpService));
  return router;
}
