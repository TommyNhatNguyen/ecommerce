import { Router } from "express";
import { Sequelize } from "sequelize";
import { inventoryInit, inventoryModelName } from "src/infras/repository/inventory/dto";
import { PostgresInventoryRepository } from "src/infras/repository/inventory/repo";
import { InventoryHttpService } from "src/infras/transport/inventory/inventory-http.service";
import { InventoryUseCase } from "src/usecase/inventory";

export function setupInventoryRouter(sequelize: Sequelize) {
  inventoryInit(sequelize)
  const router = Router();
  const inventoryRepository = new PostgresInventoryRepository(sequelize, inventoryModelName);
  const inventoryUseCase = new InventoryUseCase(inventoryRepository);
  const inventoryHttpService = new InventoryHttpService(inventoryUseCase);
  router.get('/inventories', inventoryHttpService.getInventoryList.bind(inventoryHttpService));
  router.get('/inventories/:id', inventoryHttpService.getInventory.bind(inventoryHttpService));
  router.post('/inventories', inventoryHttpService.createInventory.bind(inventoryHttpService));
  router.put('/inventories/:id', inventoryHttpService.updateInventory.bind(inventoryHttpService));
  router.delete('/inventories/:id', inventoryHttpService.deleteInventory.bind(inventoryHttpService));
  return router;
}
