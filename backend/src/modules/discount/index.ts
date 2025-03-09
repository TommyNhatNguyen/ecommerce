import { Router } from 'express';

import { Sequelize } from 'sequelize';
import { CloudinaryImageRepository } from 'src/modules/image/infras/repo/repo';
import {
  discountInit,
  discountModelName,
} from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { DiscountHttpService } from 'src/modules/discount/infras/transport/discount.http-service';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { inventoryModelName, inventoryWarehouseModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import {
  productSellableDiscountModelName,
  productSellableModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';
import cloudinary from 'src/share/cloudinary';
import { warehouseModelName } from 'src/modules/warehouse/infras/repo/warehouse.dto';
import { PostgresWarehouseRepository } from 'src/modules/warehouse/infras/repo/warehouse.repo';
import { WarehouseUseCase } from 'src/modules/warehouse/usecase';

export const setupDiscountRouter = (sequelize: Sequelize) => {
  discountInit(sequelize);
  const router = Router();
  const repository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
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
  const inventoryUseCase = new InventoryUseCase(inventoryRepository, inventoryWarehouseRepository, warehouseUseCase);
  const discountUseCase = new DiscountUseCase(repository);

  const productSellableUseCase = new ProductSellableUseCase(
    productSellableRepository,
    cloudinaryRepository,
    productSellableDiscountRepository,
    inventoryUseCase,
    discountUseCase
  );

  const useCase = new DiscountUseCase(repository, productSellableUseCase);
  const httpService = new DiscountHttpService(useCase);
  router.get('/discounts', httpService.listDiscount.bind(httpService));
  router.get('/discounts/:id', httpService.getDiscount.bind(httpService));
  router.post('/discounts', httpService.createDiscount.bind(httpService));
  router.put('/discounts/:id', httpService.updateDiscount.bind(httpService));
  router.delete('/discounts/:id', httpService.deleteDiscount.bind(httpService));
  return router;
};
