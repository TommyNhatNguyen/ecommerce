import { Router } from "express";
import { Sequelize } from "sequelize";
import { customerInit, customerModelName } from "src/infras/repository/customer/dto";
import { CustomerRepository } from "src/infras/repository/customer/repo";
import { CustomerHttpService } from "src/infras/transport/customer/customer-http.service";
import { CustomerUseCase } from "src/usecase/customer";

export const setupCustomerRouter = (sequelize: Sequelize) => {
  customerInit(sequelize)
  const router = Router();
  const customerRepository = new CustomerRepository(sequelize, customerModelName)
  const customerUseCase = new CustomerUseCase(customerRepository)
  const customerHttpService = new CustomerHttpService(customerUseCase)
  router.get('/customer', customerHttpService.getCustomerList.bind(customerHttpService))
  router.get('/customer/:id', customerHttpService.getCustomerById.bind(customerHttpService))
  router.post('/customer', customerHttpService.createCustomer.bind(customerHttpService))
  router.put('/customer/:id', customerHttpService.updateCustomer.bind(customerHttpService))
  router.delete('/customer/:id', customerHttpService.deleteCustomer.bind(customerHttpService))
  return router
}