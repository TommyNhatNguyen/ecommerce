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
} from 'src/modules/products/infras/repo/postgres/dto';
import { Sequelize } from 'sequelize';
import { PostgresProductRepository } from 'src/modules/products/infras/repo/postgres/repo';
import { ProductUseCase } from 'src/modules/products/usecase';
import { ProductHttpService } from 'src/modules/products/infras/transport/products.http-service';
import { CloudinaryImageRepository } from 'src/infras/repository/image/repo';
import cloudinary from 'src/share/cloudinary';
import { inventoryModelName } from 'src/infras/repository/inventory/dto';
import { PostgresInventoryRepository } from 'src/infras/repository/inventory/repo';
import { InventoryUseCase } from 'src/usecase/inventory';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';

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
  const useCase = new ProductUseCase(
    repository,
    cloudinaryRepository,
    productCategoryRepository,
    productDiscountRepository,
    discountRepository,
    imageRepository
  );
  const inventoryUseCase = new InventoryUseCase(inventoryRepository);
  const httpService = new ProductHttpService(useCase, inventoryUseCase);
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
