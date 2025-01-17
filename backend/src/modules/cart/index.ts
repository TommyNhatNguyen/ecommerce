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
import { productCategoryModelName, productDiscountModelName, productModelName } from 'src/modules/products/infras/repo/postgres/dto';
import { PostgresProductRepository } from 'src/modules/products/infras/repo/postgres/repo';
import { ProductUseCase } from 'src/modules/products/usecase';
import cloudinary from 'src/share/cloudinary';
import { CloudinaryImageRepository } from 'src/infras/repository/image/repo';

export function setupCartRouter(sequelize: Sequelize) {
  cartInit(sequelize);
  cartProductInit(sequelize);
  const router = Router();
  const cartRepository = new PostgresCartRepository(sequelize, cartModelName);
  const cartProductRepository = new PostgresCartRepository(
    sequelize,
    cartProductModelName
  );
  const productRepository = new PostgresProductRepository(
    sequelize,
    productModelName
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
  const productUseCase = new ProductUseCase(
    productRepository,
    cloudinaryRepository,
    productCategoryRepository,
    productDiscountRepository
  );
  const cartUseCase = new CartUseCase(
    cartRepository,
    cartProductRepository,
    productUseCase
  );
  const cartHttpService = new CartHttpService(cartUseCase);
  router.get('/cart/:id', cartHttpService.getById.bind(cartHttpService));
  router.get('/cart', cartHttpService.getList.bind(cartHttpService));
  // router.post('/cart', cartHttpService.create.bind(cartHttpService));
  router.put('/cart/:id', cartHttpService.update.bind(cartHttpService));
  router.post(
    '/cart/:id/products',
    cartHttpService.addProductsToCart.bind(cartHttpService)
  );
  // router.delete('/cart/:id', cartHttpService.delete.bind(cartHttpService));
  return router;
}
