import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { shippingModelName } from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import { shippingInit } from 'src/modules/shipping/infras/postgres/repo/shipping.dto';
import { PostgresShippingRepository } from 'src/modules/shipping/infras/postgres/repo/shipping.repo';
import { ShippingHttpService } from 'src/modules/shipping/infras/transport/shipping.http-service';
import { ShippingUseCase } from 'src/modules/shipping/usecase';

export function setupShippingRouter(sequelize: Sequelize) {
  shippingInit(sequelize);
  const router = Router();
  const shippingRepository = new PostgresShippingRepository(
    sequelize,
    shippingModelName
  );
  const shippingUseCase = new ShippingUseCase(shippingRepository);
  const shippingHttpService = new ShippingHttpService(shippingUseCase);
  router.get(
    '/shipping/:id',
    shippingHttpService.getShippingById.bind(shippingHttpService)
  );
  router.get(
    '/shipping',
    shippingHttpService.getShippingList.bind(shippingHttpService)
  );
  router.post(
    '/shipping',
    shippingHttpService.createShipping.bind(shippingHttpService)
  );
  router.put(
    '/shipping/:id',
    shippingHttpService.updateShipping.bind(shippingHttpService)
  );
  router.delete(
    '/shipping/:id',
    shippingHttpService.deleteShipping.bind(shippingHttpService)
  );
  return router;
}
