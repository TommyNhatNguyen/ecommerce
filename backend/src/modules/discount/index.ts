import { Router } from 'express';

import { Sequelize } from 'sequelize';
import {
  discountInit,
  discountModelName,
} from 'src/modules/discount/infras/repo/postgres/discount.dto';
import { PostgresDiscountRepository } from 'src/modules/discount/infras/repo/postgres/discount.repo';
import { DiscountHttpService } from 'src/modules/discount/infras/transport/discount.http-service';
import { DiscountUseCase } from 'src/modules/discount/usecase';

export const setupDiscountRouter = (sequelize: Sequelize) => {
  discountInit(sequelize);
  const router = Router();
  const repository = new PostgresDiscountRepository(
    sequelize,
    discountModelName
  );
  const useCase = new DiscountUseCase(repository);
  const httpService = new DiscountHttpService(useCase);
  router.get('/discounts', httpService.listDiscount.bind(httpService));
  router.get('/discounts/:id', httpService.getDiscount.bind(httpService));
  router.post('/discounts', httpService.createDiscount.bind(httpService));
  router.put('/discounts/:id', httpService.updateDiscount.bind(httpService));
  router.delete('/discounts/:id', httpService.deleteDiscount.bind(httpService));
  return router;
};
