import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { CloudinaryImageRepository } from 'src/infras/repository/image/repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import {
  initProductSellableDiscount,
  initProductSellableImage,
  initProductSellableVariant,
  productSellableDiscountModelName,
  productSellableImageModelName,
  productSellableModelName,
  productSellableVariantModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';

import { productSellableInit } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import { ProductSellableHttpService } from 'src/modules/product_sellable/infras/transport/product-sellable.http-service';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';
import cloudinary from 'src/share/cloudinary';

export const setupProductSellableRouter = (sequelize: Sequelize) => {
  productSellableInit(sequelize);
  initProductSellableDiscount(sequelize);
  initProductSellableImage(sequelize);
  initProductSellableVariant(sequelize);
  const repository = new PostgresProductSellableRepository(
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
  const inventoryUseCase = new InventoryUseCase(inventoryRepository);
  const productSellableVariantRepository =
    new PostgresProductSellableRepository(
      sequelize,
      productSellableVariantModelName
    );
  const discountRepository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
  );
  const discountUseCase = new DiscountUseCase(discountRepository);
  const productSellableImageRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableImageModelName
  );
  const productSellableUseCase = new ProductSellableUseCase(
    repository,
    cloudinaryRepository,
    productSellableDiscountRepository,
    inventoryUseCase,
    discountUseCase,
    productSellableVariantRepository,
    discountRepository,
    productSellableImageRepository
  );
  const httpService = new ProductSellableHttpService(productSellableUseCase);
  const router = Router();
  router.get(
    '/products-sellable',
    httpService.getProductSellables.bind(httpService)
  );
  router.get(
    '/products-sellable/:id',
    httpService.getProductSellableById.bind(httpService)
  );
  router.post(
    '/products-sellable',
    httpService.createNewProductSellable.bind(httpService)
  );
  router.put(
    '/products-sellable/:id',
    httpService.updateProductSellable.bind(httpService)
  );
  router.delete(
    '/products-sellable/:id',
    httpService.deleteProductSellable.bind(httpService)
  );
  return router;
};
