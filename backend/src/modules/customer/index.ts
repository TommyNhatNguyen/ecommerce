import { NextFunction, Request, Response, Router } from "express";
import { Sequelize } from "sequelize";
import { JWT_TYPES, jwtSign, jwtVerify } from "src/middlewares/jwt";
import { cartModelName } from "src/modules/cart/infras/repo/postgres/cart.dto";
import { PostgresCartRepository } from "src/modules/cart/infras/repo/postgres/cart.repo";
import { customerModelName } from "src/modules/customer/infras/repo/postgres/customer.dto";
import { customerInit } from "src/modules/customer/infras/repo/postgres/customer.dto";
import { PostgresCustomerRepository } from "src/modules/customer/infras/repo/postgres/customer.repo";
import { CustomerHttpService } from "src/modules/customer/infras/transport/customer.http-service";
import { CustomerUseCase } from "src/modules/customer/usecase";

export const setupCustomerRouter = (sequelize: Sequelize) => {
  customerInit(sequelize);
  const router = Router();
  const customerRepository = new PostgresCustomerRepository(
    sequelize,
    customerModelName
  );
  const cartRepository = new PostgresCartRepository(sequelize, cartModelName);
  const customerUseCase = new CustomerUseCase(
    customerRepository,
    cartRepository
  );
  const customerHttpService = new CustomerHttpService(customerUseCase);
  router.get(
    "/customer",
    customerHttpService.getCustomerList.bind(customerHttpService)
  );
  router.get(
    "/customer/:id",
    customerHttpService.getCustomerById.bind(customerHttpService)
  );
  router.post(
    "/customer",
    customerHttpService.createCustomer.bind(customerHttpService)
  );
  router.post(
    "/customer-login",
    customerHttpService.login.bind(customerHttpService),
    jwtSign
  );
  router.get(
    "/customer-info",
    (req: Request, res: Response, next: NextFunction) => {
      res.locals.type = JWT_TYPES.CUSTOMER;
      next();
    },
    jwtVerify,
    customerHttpService.getCustomerByUsername.bind(customerHttpService)
  );
  router.put(
    "/customer/:id",
    customerHttpService.updateCustomer.bind(customerHttpService)
  );
  router.delete(
    "/customer/:id",
    customerHttpService.deleteCustomer.bind(customerHttpService)
  );
  return router;
};
