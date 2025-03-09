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

export function setupInventoryRouter(sequelize: Sequelize) {
  inventoryInit(sequelize);
  inventoryWarehouseInit(sequelize);
  const router = Router();
  const inventoryRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryModelName
  );
  const inventoryWarehouseRepository = new PostgresInventoryRepository(
    sequelize,
    inventoryWarehouseModelName
  );
  const inventoryUseCase = new InventoryUseCase(
    inventoryRepository,
    inventoryWarehouseRepository
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
