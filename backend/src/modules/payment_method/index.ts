import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { paymentMethodModelName } from 'src/modules/payment_method/infras/postgres/repo/payment_method.dto';
import { paymentMethodInit } from 'src/modules/payment_method/infras/postgres/repo/payment_method.dto';
import { PostgresPaymentMethodRepository } from 'src/modules/payment_method/infras/postgres/repo/payment_method.repo';
import { PaymentMethodHttpService } from 'src/modules/payment_method/infras/transport/payment_method.http-service';
import { PaymentMethodUseCase } from 'src/modules/payment_method/usecase';

export function setupPaymentMethodRouter(sequelize: Sequelize) {
  paymentMethodInit(sequelize);
  const router = Router();
  const paymentMethodRepository = new PostgresPaymentMethodRepository(
    sequelize,
    paymentMethodModelName
  );
  const paymentMethodUseCase = new PaymentMethodUseCase(
    paymentMethodRepository
  );
  const paymentMethodHttpService = new PaymentMethodHttpService(
    paymentMethodUseCase
  );
  router.get(
    '/payment-method/:id',
    paymentMethodHttpService.getPaymentById.bind(paymentMethodHttpService)
  );
  router.get(
    '/payment-method',
    paymentMethodHttpService.getPaymentList.bind(paymentMethodHttpService)
  );
  router.post(
    '/payment-method',
    paymentMethodHttpService.createPayment.bind(paymentMethodHttpService)
  );
  router.put(
    '/payment-method/:id',
    paymentMethodHttpService.updatePayment.bind(paymentMethodHttpService)
  );
  router.delete(
    '/payment-method/:id',
    paymentMethodHttpService.deletePayment.bind(paymentMethodHttpService)
  );
  return router;
}
