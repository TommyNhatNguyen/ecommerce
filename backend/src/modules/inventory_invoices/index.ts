import { Router } from "express";
import { Sequelize } from "sequelize";
import { inventoryModelName, inventoryWarehouseModelName } from "src/modules/inventory/infras/repo/postgres/dto";
import { PostgresInventoryRepository } from "src/modules/inventory/infras/repo/postgres/repo";
import { InventoryUseCase } from "src/modules/inventory/usecase";
import { inventoryInvoiceInit, inventoryInvoiceModelName } from "src/modules/inventory_invoices/infras/repo/inventory_invoices.dto";
import { InventoryInvoiceRepository } from "src/modules/inventory_invoices/infras/repo/inventory_invoices.repo";
import { InventoryInvoiceHttpService } from "src/modules/inventory_invoices/infras/transport/inventory_invoices.http-service";
import { InventoryInvoiceUseCase } from "src/modules/inventory_invoices/usecase";
import { warehouseModelName } from "src/modules/warehouse/infras/repo/warehouse.dto";
import { PostgresWarehouseRepository } from "src/modules/warehouse/infras/repo/warehouse.repo";
import { WarehouseUseCase } from "src/modules/warehouse/usecase";

export const setupInventoryInvoiceRouter = (sequelize: Sequelize) => {
  inventoryInvoiceInit(sequelize);
  const router = Router();
  const inventoryRepository = new PostgresInventoryRepository(sequelize, inventoryModelName);
  const inventoryWarehouseRepository = new PostgresInventoryRepository(sequelize, inventoryWarehouseModelName);
  const inventoryUseCase = new InventoryUseCase(inventoryRepository, inventoryWarehouseRepository);
  const warehouseRepository = new PostgresWarehouseRepository(sequelize, warehouseModelName);
  const warehouseUseCase = new WarehouseUseCase(warehouseRepository);
  const inventoryInvoiceRepository = new InventoryInvoiceRepository(sequelize, inventoryInvoiceModelName);
  const inventoryInvoiceUseCase = new InventoryInvoiceUseCase(inventoryInvoiceRepository, inventoryUseCase, warehouseUseCase, sequelize);
  const inventoryInvoiceHttpService = new InventoryInvoiceHttpService(inventoryInvoiceUseCase);
  router.post('/inventory-invoices/transfer', inventoryInvoiceHttpService.createTransferInvoice.bind(inventoryInvoiceHttpService));
  router.get('/inventory-invoices/all', inventoryInvoiceHttpService.getAll.bind(inventoryInvoiceHttpService));
  router.post('/inventory-invoices', inventoryInvoiceHttpService.create.bind(inventoryInvoiceHttpService));
  router.get('/inventory-invoices/:id', inventoryInvoiceHttpService.getById.bind(inventoryInvoiceHttpService));
  router.get('/inventory-invoices', inventoryInvoiceHttpService.getList.bind(inventoryInvoiceHttpService));
  router.put('/inventory-invoices/:id', inventoryInvoiceHttpService.update.bind(inventoryInvoiceHttpService));
  router.delete('/inventory-invoices/:id', inventoryInvoiceHttpService.delete.bind(inventoryInvoiceHttpService));
  return router;
}