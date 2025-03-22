import { Sequelize } from 'sequelize';
import { VariantUseCase } from 'src/modules/variant/usecase';
import { Router } from 'express';
import {
  variantInit,
  variantModelName,
  variantOptionValueInit,
  variantOptionValueModelName,
} from 'src/modules/variant/infras/repo/postgres/dto';

import { VariantHttpService } from 'src/modules/variant/infras/transport/variant-http.service';
import { PostgresVariantRepository } from 'src/modules/variant/infras/repo/postgres/repo';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import {
  productSellableDiscountModelName,
  productSellableImageModelName,
  productSellableModelName,
  productSellableVariantModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { CloudinaryImageRepository } from 'src/modules/image/infras/repo/repo';
import cloudinary from 'src/share/cloudinary';
import { InventoryInvoiceRepository } from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.repo';
import { WarehouseUseCase } from 'src/modules/warehouse/usecase';
import { InventoryInvoiceUseCase } from 'src/modules/inventory_invoices/usecase';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import { PostgresWarehouseRepository } from 'src/modules/warehouse/infras/repo/warehouse.repo';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { inventoryInvoiceModelName } from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { inventoryWarehouseModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { warehouseModelName } from 'src/modules/warehouse/infras/repo/warehouse.dto';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
export function setupVariantRouter(sequelize: Sequelize) {
  variantInit(sequelize);
  variantOptionValueInit(sequelize);
  const variantRepository = new PostgresVariantRepository(
    sequelize,
    variantModelName
  );
  const variantOptionValueRepository = new PostgresVariantRepository(
    sequelize,
    variantOptionValueModelName
  );
  const productSellableRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableModelName
  );
  const cloudinaryRepository = new CloudinaryImageRepository(cloudinary);
  const productSellableDiscountRepository =
    new PostgresProductSellableRepository(
      sequelize,
      productSellableDiscountModelName
    );
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
  const inventoryUseCase = new InventoryUseCase(
    inventoryRepository,
    inventoryWarehouseRepository,
    inventoryInvoiceUseCase,
    warehouseUseCase
  );
  const discountRepository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
  );
  const discountUseCase = new DiscountUseCase(discountRepository);
  const productSellableVariantRepository =
    new PostgresProductSellableRepository(
      sequelize,
      productSellableVariantModelName
    );
  const productSellableImageRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableImageModelName
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
  const variantUseCase = new VariantUseCase(
    variantRepository,
    variantOptionValueRepository,
    productSellableUseCase
  );
  const variantHttpService = new VariantHttpService(variantUseCase);
  const router = Router();
  router.get(
    '/variants/:id',
    variantHttpService.getVariantById.bind(variantHttpService)
  );
  router.get(
    '/variants',
    variantHttpService.listVariant.bind(variantHttpService)
  );
  router.post(
    '/variants',
    variantHttpService.createVariant.bind(variantHttpService)
  );
  router.put(
    '/variants/:id',
    variantHttpService.updateVariant.bind(variantHttpService)
  );
  router.delete(
    '/variants/:id',
    variantHttpService.deleteVariant.bind(variantHttpService)
  );
  return router;
}
