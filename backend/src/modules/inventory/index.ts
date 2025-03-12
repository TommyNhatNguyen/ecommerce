import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  inventoryInit,
  inventoryModelName,
  inventoryWarehouseInit,
  inventoryWarehouseModelName,
} from 'src/modules/inventory/infras/repo/postgres/dto';
import { PostgresInventoryRepository } from 'src/modules/inventory/infras/repo/postgres/repo';
import { InventoryHttpService } from 'src/modules/inventory/infras/transport/inventory.http-service';
import { InventoryUseCase } from 'src/modules/inventory/usecase';
import { InventoryInvoiceUseCase } from 'src/modules/inventory_invoices/usecase';
import { inventoryInvoiceModelName } from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.dto';
import { warehouseModelName } from 'src/modules/warehouse/infras/repo/warehouse.dto';
import { PostgresWarehouseRepository } from 'src/modules/warehouse/infras/repo/warehouse.repo';
import { WarehouseUseCase } from 'src/modules/warehouse/usecase';
import { InventoryInvoiceRepository } from 'src/modules/inventory_invoices/infras/repo/inventory_invoices.repo';

export function setupInventoryRouter(sequelize: Sequelize) {
  inventoryInit(sequelize);
  inventoryWarehouseInit(sequelize);
  const router = Router();
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const warehouseRepository = new PostgresWarehouseRepository(
    sequelize,
    warehouseModelName
  );
  const warehouseUseCase = new WarehouseUseCase(warehouseRepository);
  const inventoryWarehouseRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryWarehouseModelName
  );
  const inventoryInvoiceRepository = new InventoryInvoiceRepository(
    sequelize,
    inventoryInvoiceModelName
  );
  const inventoryInvoiceUseCase = new InventoryInvoiceUseCase(
    inventoryInvoiceRepository
  );
  const inventoryUseCase = new InventoryUseCase(
    inventoryRepository,
    inventoryWarehouseRepository,
    inventoryInvoiceUseCase,
    warehouseUseCase
  );
  const inventoryHttpService = new InventoryHttpService(inventoryUseCase);
  router.get(
    '/inventories',
    inventoryHttpService.getInventoryList.bind(inventoryHttpService)
  );
  router.get(
    '/inventories/:id',
    inventoryHttpService.getInventory.bind(inventoryHttpService)
  );
  router.post(
    '/inventories',
    inventoryHttpService.createInventory.bind(inventoryHttpService)
  );
  router.put(
    '/inventories/:id',
    inventoryHttpService.updateInventory.bind(inventoryHttpService)
  );
  router.delete(
    '/inventories/:id',
    inventoryHttpService.deleteInventory.bind(inventoryHttpService)
  );
  return router;
}
