import { Router } from 'express';
import {
  init,
  initProductCategory,
  productCategoryModelName,
  productModelName,
} from 'src/modules/products/infras/repo/postgres/dto';
import { Sequelize } from 'sequelize';
import { PostgresProductRepository } from 'src/modules/products/infras/repo/postgres/repo';
import { ProductUseCase } from 'src/modules/products/usecase';
import { ProductHttpService } from 'src/modules/products/infras/transport/products.http-service';
import { variantModelName, variantOptionValueModelName } from 'src/modules/variant/infras/repo/postgres/dto';
import { PostgresVariantRepository } from 'src/modules/variant/infras/repo/postgres/repo';
import { VariantUseCase } from 'src/modules/variant/usecase';
import {
  productSellableDiscountModelName,
  productSellableImageModelName,
  productSellableModelName,
  productSellableVariantModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import { CloudinaryImageRepository } from 'src/infras/repository/image/repo';
import cloudinary from 'src/share/cloudinary';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';

export const setupProductRouter = (sequelize: Sequelize) => {
  init(sequelize);
  initProductCategory(sequelize);
  const repository = new PostgresProductRepository(sequelize, productModelName);
  const productCategoryRepository = new PostgresProductRepository(
    sequelize,
    productCategoryModelName
  );
  const variantRepository = new PostgresVariantRepository(
    sequelize,
    variantModelName
  );
  const variantOptionValueRepository = new PostgresVariantRepository(
    sequelize,
    variantOptionValueModelName
  );
  const variantUseCase = new VariantUseCase(
    variantRepository,
    variantOptionValueRepository
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
    productSellableRepository,
    cloudinaryRepository,
    productSellableDiscountRepository,
    inventoryUseCase,
    productSellableVariantRepository,
    discountRepository,
    productSellableImageRepository,
    discountUseCase
  );
  const useCase = new ProductUseCase(
    repository,
    productCategoryRepository,
    variantUseCase,
    productSellableUseCase,
    sequelize
  );
  const httpService = new ProductHttpService(useCase);
  const router = Router();
  router.get('/products', httpService.getProducts.bind(httpService));
  router.get('/products/:id', httpService.getProductById.bind(httpService));
  router.post('/products', httpService.createNewProduct.bind(httpService));
  router.put('/products/:id', httpService.updateProduct.bind(httpService));
  router.delete('/products/:id', httpService.deleteProduct.bind(httpService));

  return router;
};
