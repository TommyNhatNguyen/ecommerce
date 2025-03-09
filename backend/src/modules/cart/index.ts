import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { PostgresCartRepository } from 'src/modules/cart/infras/repo/postgres/cart.repo';
import {
  cartInit,
  cartModelName,
  cartProductInit,
  cartProductModelName,
} from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { CartUseCase } from 'src/modules/cart/usecase';
import { CartHttpService } from 'src/modules/cart/infras/transport/cart.http-service';
import cloudinary from 'src/share/cloudinary';
import { CloudinaryImageRepository } from 'src/modules/image/infras/repo/repo';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import { PostgresProductSellableRepository } from 'src/modules/product_sellable/infras/repo/postgres/repo';
import {
  productSellableDiscountModelName,
  productSellableImageModelName,
  productSellableModelName,
  productSellableVariantModelName,
} from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { DiscountUseCase } from 'src/modules/discount/usecase';
import { ProductSellableUseCase } from 'src/modules/product_sellable/usecase';
import { discountModelName } from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';

export function setupCartRouter(sequelize: Sequelize) {
  cartInit(sequelize);
  cartProductInit(sequelize);
  const router = Router();
  const cartRepository = new PostgresCartRepository(sequelize, cartModelName);
  const cartProductRepository = new PostgresCartRepository(
    sequelize,
    cartProductModelName
  );
  const cloudinaryRepository = new CloudinaryImageRepository(cloudinary);
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const inventoryUseCase = new InventoryUseCase(inventoryRepository);
  const productSellableRepository = new PostgresProductSellableRepository(
    sequelize,
    productSellableModelName
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

  const discountRepository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
  );
  const discountUseCase = new DiscountUseCase(discountRepository);

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
  const cartUseCase = new CartUseCase(
    cartRepository,
    cartProductRepository,
    productSellableUseCase
  );
  const cartHttpService = new CartHttpService(cartUseCase);
  router.get('/cart/:id', cartHttpService.getById.bind(cartHttpService));
  router.get('/cart', cartHttpService.getList.bind(cartHttpService));
  // router.post('/cart', cartHttpService.create.bind(cartHttpService));
  router.put('/cart/:id', cartHttpService.update.bind(cartHttpService));
  router.post(
    '/cart/add-to-cart',
    cartHttpService.addProductsToCart.bind(cartHttpService)
  );
  // router.delete('/cart/:id', cartHttpService.delete.bind(cartHttpService));
  return router;
}
