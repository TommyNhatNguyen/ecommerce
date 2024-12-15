import { Router } from 'express';
import { getProductApi } from 'src/infras/transport/product/get-api';
import { deleteProductApi } from 'src/infras/transport/product/delete-api';
import { updateProductApi } from 'src/infras/transport/product/update-api';
import { listProductApi } from 'src/infras/transport/product/list-api';
import { init, productModelName } from 'src/infras/repository/product/dto';
import { Sequelize } from 'sequelize';
import { createProductApi } from 'src/infras/transport/product/create-api';
import { PostgresProductRepository } from 'src/infras/repository/product/repo';
import { ProductUseCase } from 'src/usecase/product';
import { ProductHttpService } from 'src/infras/transport/product/http-service';

export const setupProductRouter = (sequelize: Sequelize) => {
  init(sequelize);
  const repository = new PostgresProductRepository(sequelize, productModelName);
  const useCase = new ProductUseCase(repository);
  const httpService = new ProductHttpService(useCase);
  const router = Router();
  router.get('/products', listProductApi());
  router.get('/products/:id', getProductApi());
  router.post('/products', httpService.createNewProduct.bind(httpService));
  router.put('/products/:id', updateProductApi());
  router.delete('/products/:id', deleteProductApi());
  return router;
};
