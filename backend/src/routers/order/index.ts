import { Router } from "express";
import { Sequelize } from "sequelize";
import { orderInit, orderModelName } from "src/infras/repository/order/dto";
import { PostgresOrderRepository } from "src/infras/repository/order/repo";
import { OrderUseCase } from "src/usecase/order";
import { OrderHttpService } from "src/infras/transport/order/order-http.service";

export function setupOrderRouter(sequelize: Sequelize) {
  orderInit(sequelize);
  const router = Router();
  const orderRepository = new PostgresOrderRepository(sequelize, orderModelName);
  const orderUseCase = new OrderUseCase(orderRepository);
  const orderHttpService = new OrderHttpService(orderUseCase);
  router.get('/order/:id', orderHttpService.getById.bind(orderHttpService));
  router.get('/order', orderHttpService.getList.bind(orderHttpService));
  router.post('/order', orderHttpService.create.bind(orderHttpService));
  router.put('/order/:id', orderHttpService.update.bind(orderHttpService));
  router.delete('/order/:id', orderHttpService.delete.bind(orderHttpService));
  return router;
}
