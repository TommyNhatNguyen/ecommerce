import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  couponInit,
  couponModelName,
} from 'src/modules/coupon/infras/repo/postgres/coupon.dto';
import { PostgresCouponRepository } from 'src/modules/coupon/infras/repo/postgres/coupon.repo';
import { CouponHttpService } from 'src/modules/coupon/infras/transport/coupon.http-service';
import { CouponUseCase } from 'src/modules/coupon/usecase';

export const setupCouponRouter = (sequelize: Sequelize) => {
  couponInit(sequelize);
  const router = Router();
  const repository = new PostgresCouponRepository(sequelize, couponModelName);
  const useCase = new CouponUseCase(repository);
  const httpService = new CouponHttpService(useCase);
  router.get('/coupons', httpService.getListCoupon.bind(httpService));
  router.get('/coupons/:id', httpService.getCoupon.bind(httpService));
  router.post('/coupons', httpService.createCoupon.bind(httpService));
  router.put('/coupons/:id', httpService.updateCoupon.bind(httpService));
  router.delete('/coupons/:id', httpService.deleteCoupon.bind(httpService));
  return router;
};
