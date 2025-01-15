import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { PostgresCartRepository } from 'src/modules/cart/infras/repo/postgres/cart.repo';
import {
  cartInit,
  cartModelName,
} from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { CartUseCase } from 'src/modules/cart/usecase';
import { CartHttpService } from 'src/modules/cart/infras/transport/cart.http-service';

export function setupCartRouter(sequelize: Sequelize) {
  cartInit(sequelize);
  const router = Router();
  const cartRepository = new PostgresCartRepository(sequelize, cartModelName);
  const cartUseCase = new CartUseCase(cartRepository);
  const cartHttpService = new CartHttpService(cartUseCase);
  router.get('/cart/:id', cartHttpService.getById.bind(cartHttpService));
  router.get('/cart', cartHttpService.getList.bind(cartHttpService));
  // router.post('/cart', cartHttpService.create.bind(cartHttpService));
  router.put('/cart/:id', cartHttpService.update.bind(cartHttpService));
  // router.delete('/cart/:id', cartHttpService.delete.bind(cartHttpService));
  return router;
}
