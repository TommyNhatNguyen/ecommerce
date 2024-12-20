import { Router } from "express";

import { Sequelize } from "sequelize";
import { discountInit, discountModelName } from "src/infras/repository/discount/dto";
import { PostgresDiscountRepository } from "src/infras/repository/discount/repo";
import { DiscountHttpService } from "src/infras/transport/discount/discount-http.service";
import { DiscountUseCase } from "src/usecase/discount";

export const setupDiscountRouter = (sequelize: Sequelize) => {
  discountInit(sequelize)
  const router = Router();
  const repository = new PostgresDiscountRepository(sequelize, discountModelName)
  const useCase = new DiscountUseCase(repository)
  const httpService = new DiscountHttpService(useCase)
  router.get('/discounts', httpService.listDiscounts.bind(httpService))
  router.get('/discounts/:id', httpService.getDiscounts.bind(httpService))
  router.post('/discounts', httpService.createDiscount.bind(httpService))
  router.put('/discounts/:id', httpService.updateDiscount.bind(httpService))
  router.delete('/discounts/:id', httpService.deleteDiscount.bind(httpService))
  return router;
};
