import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { PostgresCartRepository } from 'src/modules/cart/infras/repo/postgres/cart.repo';
import {
  cartInit,
  cartModelName,
} from 'src/modules/cart/infras/repo/postgres/cart.dto';
import { CartUseCase } from 'src/modules/cart/usecase';
import { CartHttpService } from 'src/modules/cart/infras/transport/cart.http-service';
import { costInit } from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { costModelName } from 'src/modules/cost/infras/repo/postgres/cost.dto';
import { PostgresCostRepository } from 'src/modules/cost/infras/repo/postgres/cost.repo';
import { CostUseCase } from 'src/modules/cost/usecase';
import { CostHttpService } from 'src/modules/cost/infras/transport/cost.http-service';

export function setupCostRouter(sequelize: Sequelize) {
  costInit(sequelize);
  const router = Router();
  const costRepository = new PostgresCostRepository(sequelize, costModelName);
  const costUseCase = new CostUseCase(costRepository);
  const costHttpService = new CostHttpService(costUseCase);
  router.get('/cost/:id', costHttpService.getById.bind(costHttpService));
  router.get('/cost', costHttpService.getList.bind(costHttpService));
  router.post('/cost', costHttpService.create.bind(costHttpService));
  router.put('/cost/:id', costHttpService.update.bind(costHttpService));
  router.delete('/cost/:id', costHttpService.delete.bind(costHttpService));
  return router;
}
