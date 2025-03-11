import { Router } from "express";
import { Sequelize } from "sequelize";
import { inventoryInvoiceInit, inventoryInvoiceModelName } from "src/modules/inventory_invoices/infras/repo/inventory_invoices.dto";
import { InventoryInvoiceRepository } from "src/modules/inventory_invoices/infras/repo/inventory_invoices.repo";
import { InventoryInvoiceHttpService } from "src/modules/inventory_invoices/infras/transport/inventory_invoices.http-service";
import { InventoryInvoiceUseCase } from "src/modules/inventory_invoices/usecase";

export const setupInventoryInvoiceRouter = (sequelize: Sequelize) => {
  inventoryInvoiceInit(sequelize);
  const router = Router();
  const inventoryInvoiceRepository = new InventoryInvoiceRepository(sequelize, inventoryInvoiceModelName);
  const inventoryInvoiceUseCase = new InventoryInvoiceUseCase(inventoryInvoiceRepository);
  const inventoryInvoiceHttpService = new InventoryInvoiceHttpService(inventoryInvoiceUseCase);
  router.get('/inventory-invoices/all', inventoryInvoiceHttpService.getAll.bind(inventoryInvoiceHttpService));
  router.post('/inventory-invoices', inventoryInvoiceHttpService.create.bind(inventoryInvoiceHttpService));
  router.get('/inventory-invoices/:id', inventoryInvoiceHttpService.getById.bind(inventoryInvoiceHttpService));
  router.get('/inventory-invoices', inventoryInvoiceHttpService.getList.bind(inventoryInvoiceHttpService));
  router.put('/inventory-invoices/:id', inventoryInvoiceHttpService.update.bind(inventoryInvoiceHttpService));
  router.delete('/inventory-invoices/:id', inventoryInvoiceHttpService.delete.bind(inventoryInvoiceHttpService));
  return router;
}