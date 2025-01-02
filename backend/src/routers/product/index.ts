import { Router } from 'express';
import { init, initProductCategory, initProductDiscount, initProductImage,  initProductOrder,  initProductVariant, productModelName } from 'src/infras/repository/product/dto';
import { Sequelize } from 'sequelize';
import { PostgresProductRepository } from 'src/infras/repository/product/repo';
import { ProductUseCase } from 'src/usecase/product';
import { ProductHttpService } from 'src/infras/transport/product/http-service';
import { CloudinaryImageRepository } from 'src/infras/repository/image/repo';
import cloudinary from 'src/share/cloudinary';

export const setupProductRouter = (sequelize: Sequelize) => {
  init(sequelize);
  initProductCategory(sequelize);
  initProductDiscount(sequelize);
  initProductVariant(sequelize);
  initProductImage(sequelize);
  initProductOrder(sequelize);
  const repository = new PostgresProductRepository(sequelize, productModelName);
  const cloudinaryRepository = new CloudinaryImageRepository(cloudinary);
  const useCase = new ProductUseCase(repository, cloudinaryRepository);
  const httpService = new ProductHttpService(useCase);
  const router = Router();
  router.get('/products', httpService.getProducts.bind(httpService));
  router.get('/products/:id', httpService.getProductById.bind(httpService));
  router.post('/products', httpService.createNewProduct.bind(httpService));
  router.put('/products/:id', httpService.updateProduct.bind(httpService));
  router.delete('/products/:id', httpService.deleteProduct.bind(httpService));
  return router;
};
