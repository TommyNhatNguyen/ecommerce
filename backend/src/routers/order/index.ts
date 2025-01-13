import { Router } from "express";
import { Sequelize } from "sequelize";
import { orderInit, orderModelName } from "src/infras/repository/order/dto";
import { PostgresOrderRepository } from "src/infras/repository/order/repo";
import { OrderUseCase } from "src/usecase/order";
import { OrderHttpService } from "src/infras/transport/order/order-http.service";
import { PostgresProductRepository } from "src/infras/repository/product/repo";
import { productModelName } from "src/infras/repository/product/dto";
import { customerModelName } from "src/infras/repository/customer/dto";
import { CustomerRepository } from "src/infras/repository/customer/repo";

export function setupOrderRouter(sequelize: Sequelize) {
  orderInit(sequelize);
  const router = Router();
  const orderRepository = new PostgresOrderRepository(sequelize, orderModelName);
  const productRepository = new PostgresProductRepository(sequelize, productModelName);
  const customerRepository = new CustomerRepository(sequelize, customerModelName);
  const orderUseCase = new OrderUseCase(orderRepository, productRepository, customerRepository);
  const orderHttpService = new OrderHttpService(orderUseCase);
  router.get('/order/:id', orderHttpService.getById.bind(orderHttpService));
  router.get('/order', orderHttpService.getList.bind(orderHttpService));
  router.post('/order', orderHttpService.create.bind(orderHttpService));
  router.put('/order/:id', orderHttpService.update.bind(orderHttpService));
  router.delete('/order/:id', orderHttpService.delete.bind(orderHttpService));
  return router;
}
