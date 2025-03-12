import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { customerModelName } from 'src/modules/customer/infras/repo/postgres/customer.dto';
import {
  orderDetailCostInit,
  orderDetailCostModelName,
  orderDetailDiscountInit,
  orderDetailDiscountModelName,
  orderDetailInit,
  orderDetailModelName,
  orderDetailProductSellableInit,
  orderDetailProductSellableModelName,
  PostgresOrderDetailCostPersistence,
} from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { PostgresOrderDetailRepository } from 'src/modules/order_detail/infras/repo/postgres/order_detail.repo';
import { OrderDetailHttpService } from 'src/modules/order_detail/infras/transport/order_detail.http-service';
import { OrderDetailUseCase } from 'src/modules/order_detail/usecase';
import { PostgresCustomerRepository } from 'src/modules/customer/infras/repo/postgres/customer.repo';
import { CustomerUseCase } from 'src/modules/customer/usecase';
import { cartModelName } from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { PostgresCartRepository } from 'src/modules/cart/infras/repo/postgres/cart.repo';
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
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { PostgresProductRepository } from 'src/modules/products/infras/repo/postgres/repo';
import {
  productCategoryModelName,
  productModelName,
} from 'src/modules/products/infras/repo/postgres/dto';
import { ProductUseCase } from 'src/modules/products/usecase';
import { CloudinaryImageRepository } from 'src/modules/image/infras/repo/repo';
import cloudinary from 'src/share/cloudinary';
import { inventoryModelName, inventoryWarehouseModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import {
  productSellableImageModelName,
  productSellableModelName,
  productSellableVariantModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { productSellableDiscountModelName } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';
import { PostgresWarehouseRepository } from 'src/modules/warehouse/infras/repo/warehouse.repo';
import { warehouseModelName } from 'src/modules/warehouse/infras/repo/warehouse.dto';
import { WarehouseUseCase } from 'src/modules/warehouse/usecase';
import { InventoryInvoiceRepository } from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.repo';
import { InventoryInvoiceUseCase } from 'src/modules/inventory_invoices/usecase';
import { inventoryInvoiceModelName } from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.dto';
export function setupOrderDetailRouter(sequelize: Sequelize) {
  orderDetailInit(sequelize);
  orderDetailProductSellableInit(sequelize);
  orderDetailCostInit(sequelize);
  orderDetailDiscountInit(sequelize);
  const router = Router();
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
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const inventoryWarehouseRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryWarehouseModelName
  );
  const warehouseRepository = new PostgresWarehouseRepository(
    sequelize,
    warehouseModelName
  );
  const warehouseUseCase = new WarehouseUseCase(warehouseRepository);
  const inventoryInvoiceRepository = new InventoryInvoiceRepository(
    sequelize,
    inventoryInvoiceModelName
  );
  const inventoryInvoiceUseCase = new InventoryInvoiceUseCase(
    inventoryInvoiceRepository
  );
  const inventoryUseCase = new InventoryUseCase(inventoryRepository, inventoryWarehouseRepository, inventoryInvoiceUseCase, warehouseUseCase);

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
  const productSellableRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableModelName
  );

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
    warehouseUseCase,
    sequelize
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
