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
  orderDetailProductSellableModelName,
} from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { PostgresOrderDetailRepository } from 'src/modules/order_detail/infras/repo/postgres/order_detail.repo';
import { OrderDetailUseCase } from 'src/modules/order_detail/usecase';
import { CostUseCase } from 'src/modules/cost/usecase';
import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { PostgresCartRepository } from 'src/modules/cart/infras/repo/postgres/cart.repo';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import { PostgresProductRepository } from 'src/modules/products/infras/repo/postgres/repo';
import {
  cartModelName,
  cartProductModelName,
} from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { PostgresShippingRepository } from 'src/modules/shipping/infras/postgres/repo/shipping.repo';
import {
  productCategoryModelName,
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
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';
import {
  productSellableDiscountModelName,
  productSellableImageModelName,
  productSellableModelName,
  productSellableVariantModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import Websocket from 'src/socket/infras/repo';
import { SocketUseCase } from 'src/socket/usecase';
import { CartUseCase } from 'src/modules/cart/usecase';
import { checkJwtActor } from 'src/middlewares/check-jwt-actor';
import { MessageUsecase } from 'src/modules/messages/usecase';
import { messageModelName } from 'src/modules/messages/infras/repo/postgres/dto';
import { PostgresMessageRepository } from 'src/modules/messages/infras/repo/postgres/repo';
import { actorModelName } from 'src/modules/messages/actor/infras/postgres/dto';
import { PostgresActorRepository } from 'src/modules/messages/actor/infras/postgres/repo';
import { ActorUsecase } from 'src/modules/messages/actor/usecase';
import { EntityUsecase } from 'src/modules/messages/entity/usecase';
import { entityModelName } from 'src/modules/messages/entity/infras/postgres/dto';
import { PostgresEntityRepository } from 'src/modules/messages/entity/infras/postgres/repo';
import { userModelName } from 'src/modules/user/infras/repo/dto';
import { PostgresUserRepository } from 'src/modules/user/infras/repo/repo';
import { UserUseCase } from 'src/modules/user/usecase';
import Publisher from 'src/brokers/infras/publisher';

export function setupOrderRouter(
  sequelize: Sequelize,
  orderAlertPublisher: Publisher
) {
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
  const orderDetailProductSellableRepository =
    new PostgresOrderDetailRepository(
      sequelize,
      orderDetailProductSellableModelName
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
  const cartProductRepository = new PostgresCartRepository(
    sequelize,
    cartProductModelName
  );
  const productSellableRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableModelName
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
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const productSellableDiscountRepository =
    new PostgresProductSellableRepository(
      sequelize,
      productSellableDiscountModelName
    );
  const productSellableVariantRepository =
    new PostgresProductSellableRepository(
      sequelize,
      productSellableVariantModelName
    );
  const productSellableImageRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableImageModelName
  );
  const discountUseCase = new DiscountUseCase(discountRepository);
  const inventoryUseCase = new InventoryUseCase(inventoryRepository);

  const productSellableUseCase = new ProductSellableUseCase(
    productSellableRepository,
    cloudinaryRepository,
    productSellableDiscountRepository,
    inventoryUseCase,
    discountUseCase,
    productSellableVariantRepository,
    discountRepository,
    productSellableImageRepository
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
  const cartUseCase = new CartUseCase(
    cartRepository,
    cartProductRepository,
    productSellableUseCase
  );
  const orderDetailUseCase = new OrderDetailUseCase(
    orderDetailRepository,
    orderDetailProductSellableRepository,
    orderDetailDiscountRepository,
    orderDetailCostRepository,
    customerUseCase,
    productSellableUseCase,
    shippingUseCase,
    paymentUseCase,
    paymentMethodUseCase,
    costUseCase,
    discountUseCase,
    inventoryUseCase,
    sequelize
  );

  const actorRepository = new PostgresActorRepository(
    sequelize,
    actorModelName
  );
  const actorUsecase = new ActorUsecase(actorRepository);
  const entityRepository = new PostgresEntityRepository(
    sequelize,
    entityModelName
  );
  const entityUsecase = new EntityUsecase(entityRepository);

  const messageRepository = new PostgresMessageRepository(
    sequelize,
    messageModelName
  );

  const messageUsecase = new MessageUsecase(
    messageRepository,
    actorUsecase,
    entityUsecase,
    customerUseCase
  );

  const userRepository = new PostgresUserRepository(sequelize, userModelName);
  const userUsecase = new UserUseCase(userRepository, cloudinaryRepository);

  const orderUseCase = new OrderUseCase(
    orderRepository,
    orderDetailUseCase,
    cartUseCase,
    messageUsecase,
    userUsecase,
    orderAlertPublisher
  );
  const orderHttpService = new OrderHttpService(orderUseCase);
  router.get('/order/:id', orderHttpService.getById.bind(orderHttpService));
  router.get('/order', orderHttpService.getList.bind(orderHttpService));
  router.post(
    '/order',
    checkJwtActor,
    orderHttpService.create.bind(orderHttpService)
  );
  router.put('/order/:id', orderHttpService.update.bind(orderHttpService));
  router.delete('/order/:id', orderHttpService.delete.bind(orderHttpService));
  return router;
}
