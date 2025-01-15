import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  orderDetailInit,
  orderDetailModelName,
} from 'src/modules/order_detail/infras/repo/postgres/order_detail.dto';
import { PostgresOrderDetailRepository } from 'src/modules/order_detail/infras/repo/postgres/order_detail.repo';
import { OrderDetailHttpService } from 'src/modules/order_detail/infras/transport/order_detail.http-service';
import { OrderDetailUseCase } from 'src/modules/order_detail/usecase';

export function setupOrderDetailRouter(sequelize: Sequelize) {
  orderDetailInit(sequelize);
  const router = Router();
  const orderDetailRepository = new PostgresOrderDetailRepository(
    sequelize,
    orderDetailModelName
  );
  const orderDetailUseCase = new OrderDetailUseCase(orderDetailRepository);
  const orderDetailHttpService = new OrderDetailHttpService(orderDetailUseCase);
  router.get(
    '/order-detail/:id',
    orderDetailHttpService.getById.bind(orderDetailHttpService)
  );
  router.get(
    '/order-detail',
    orderDetailHttpService.getList.bind(orderDetailHttpService)
  );
  router.post(
    '/order-detail',
    orderDetailHttpService.create.bind(orderDetailHttpService)
  );
  router.put(
    '/order-detail/:id',
    orderDetailHttpService.update.bind(orderDetailHttpService)
  );
  router.delete(
    '/order-detail/:id',
    orderDetailHttpService.delete.bind(orderDetailHttpService)
  );
  return router;
}
