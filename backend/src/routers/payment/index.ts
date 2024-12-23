import { Sequelize } from "sequelize";
import { PaymentHttpService } from "src/infras/transport/payment/payment-http.service";
import { PaymentUseCase } from "src/usecase/payment";
import { Router } from "express";
import { paymentInit, paymentModelName } from "src/infras/repository/payment/dto";
import { PostgresPaymentRepository } from "src/infras/repository/payment/repo";
export const setupPaymentRouter = (sequelize: Sequelize) => {
  paymentInit(sequelize)
  const router = Router()
  const paymentRepository = new PostgresPaymentRepository(sequelize, paymentModelName)
  const paymentUseCase = new PaymentUseCase(paymentRepository)
  const paymentHttpService = new PaymentHttpService(paymentUseCase)
  router.get("/payments", paymentHttpService.getPayments.bind(paymentHttpService))
  router.get("/payments/:id", paymentHttpService.getPaymentById.bind(paymentHttpService))
  router.post("/payments", paymentHttpService.createPayment.bind(paymentHttpService))
  router.put("/payments/:id", paymentHttpService.updatePayment.bind(paymentHttpService))
  router.delete("/payments/:id", paymentHttpService.deletePayment.bind(paymentHttpService))
  return router
}