import { Router } from 'express';
import { PostgresPaymentRepository } from 'src/modules/payment/infras/repo/postgres/payment.repo';
import { paymentInit } from 'src/modules/payment/infras/repo/postgres/payment.dto';
import { Sequelize } from 'sequelize';
import { PaymentUseCase } from './usecase';
import { PaymentHttpService } from './infras/transport/payment.http-service';
import { paymentModelName } from 'src/modules/payment/infras/repo/postgres/payment.dto';

export const setupPaymentRouter = (sequelize: Sequelize) => {
  paymentInit(sequelize);
  const router = Router();
  const paymentRepository = new PostgresPaymentRepository(
    sequelize,
    paymentModelName
  );
  const paymentUseCase = new PaymentUseCase(paymentRepository);
  const paymentHttpService = new PaymentHttpService(paymentUseCase);
  router.get(
    '/payments',
    paymentHttpService.getPayments.bind(paymentHttpService)
  );
  router.get(
    '/payments/:id',
    paymentHttpService.getPaymentById.bind(paymentHttpService)
  );
  router.post(
    '/payments',
    paymentHttpService.createPayment.bind(paymentHttpService)
  );
  router.put(
    '/payments/:id',
    paymentHttpService.updatePayment.bind(paymentHttpService)
  );
  router.delete(
    '/payments/:id',
    paymentHttpService.deletePayment.bind(paymentHttpService)
  );
  return router;
};
