import { Router } from "express";
import { Sequelize } from "sequelize";
import { shippingInit, shippingModelName } from "src/infras/repository/shipping/dto";
import { PostgresShippingRepository } from "src/infras/repository/shipping/repo";
import { ShippingHttpService } from "src/infras/transport/shipping/shipping-http.service";
import { ShippingUseCase } from "src/usecase/shipping";

export function setupShippingRouter(sequelize: Sequelize) {
  shippingInit(sequelize);
  const router = Router()
  const shippingRepository = new PostgresShippingRepository(sequelize, shippingModelName)
  const shippingUseCase = new ShippingUseCase(shippingRepository)
  const shippingHttpService = new ShippingHttpService(shippingUseCase)
  router.get('/shipping/:id', shippingHttpService.getShippingById.bind(shippingHttpService))
  router.get('/shipping', shippingHttpService.getShippingList.bind(shippingHttpService))
  router.post('/shipping', shippingHttpService.createShipping.bind(shippingHttpService))
  router.put('/shipping/:id', shippingHttpService.updateShipping.bind(shippingHttpService))
  router.delete('/shipping/:id', shippingHttpService.deleteShipping.bind(shippingHttpService))
  return router
}