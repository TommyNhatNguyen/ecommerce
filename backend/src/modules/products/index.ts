import { Router } from 'express';
import {
  init,
  initProductCategory,
  initProductDiscount,
  initProductImage,
  initProductVariant,
  productCategoryModelName,
  productDiscountModelName,
  productImageModelName,
  productModelName,
  productVariantModelName,
} from 'src/modules/products/infras/repo/postgres/dto';
import { Sequelize } from 'sequelize';
import { PostgresProductRepository } from 'src/modules/products/infras/repo/postgres/repo';
import { ProductUseCase } from 'src/modules/products/usecase';
import { ProductHttpService } from 'src/modules/products/infras/transport/products.http-service';
import { CloudinaryImageRepository } from 'src/infras/repository/image/repo';
import cloudinary from 'src/share/cloudinary';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { DiscountUseCase } from '../discount/usecase';

export const setupProductRouter = (sequelize: Sequelize) => {
  init(sequelize);
  initProductCategory(sequelize);
  initProductDiscount(sequelize);
  initProductVariant(sequelize);
  initProductImage(sequelize);
  const repository = new PostgresProductRepository(sequelize, productModelName);
  const productCategoryRepository = new PostgresProductRepository(
    sequelize,
    productCategoryModelName
  );
  const productDiscountRepository = new PostgresProductRepository(
    sequelize,
    productDiscountModelName
  );
  const discountRepository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
  );
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const cloudinaryRepository = new CloudinaryImageRepository(cloudinary);
  const imageRepository = new PostgresProductRepository(
    sequelize,
    productImageModelName
  );
  const productVariantRepository = new PostgresProductRepository(
    sequelize,
    productVariantModelName
  );
  const inventoryUseCase = new InventoryUseCase(inventoryRepository);
  const discountUseCase = new DiscountUseCase(discountRepository)
  const useCase = new ProductUseCase(
    repository,
    cloudinaryRepository,
    productCategoryRepository,
    productDiscountRepository,
    inventoryUseCase,
    productVariantRepository,
    discountRepository,
    imageRepository,
    discountUseCase
  );
  const httpService = new ProductHttpService(useCase);
  const router = Router();
  router.get('/products', httpService.getProducts.bind(httpService));
  router.get('/products/:id', httpService.getProductById.bind(httpService));
  router.post('/products', httpService.createNewProduct.bind(httpService));
  router.put('/products/:id', httpService.updateProduct.bind(httpService));
  router.delete('/products/:id', httpService.deleteProduct.bind(httpService));
  router.get(
    '/statistics/products',
    httpService.getProductStatistics.bind(httpService)
  );
  return router;
};
