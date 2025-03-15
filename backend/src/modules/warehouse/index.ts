import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  warehouseInit,
  warehouseModelName,
} from 'src/modules/warehouse/infras/repo/warehouse.dto';
import { PostgresWarehouseRepository } from 'src/modules/warehouse/infras/repo/warehouse.repo';
import { WarehouseHttpService } from 'src/modules/warehouse/infras/transport/warehouse.http-service';
import { WarehouseUseCase } from 'src/modules/warehouse/usecase';

export function setupWarehouseRouter(sequelize: Sequelize) {
  warehouseInit(sequelize);
  const router = Router();
  const warehouseRepository = new PostgresWarehouseRepository(
    sequelize,
    warehouseModelName
  );
  const warehouseUseCase = new WarehouseUseCase(warehouseRepository);
  const warehouseHttpService = new WarehouseHttpService(warehouseUseCase);
  router.get(
    '/warehouses/all',
    warehouseHttpService.getAllWarehouse.bind(warehouseHttpService)
  );
  router.get(
    '/warehouses',
    warehouseHttpService.getWarehouseList.bind(warehouseHttpService)
  );
  router.get(
    '/warehouses/:id',
    warehouseHttpService.getWarehouse.bind(warehouseHttpService)
  );
  router.post(
    '/warehouses',
    warehouseHttpService.createWarehouse.bind(warehouseHttpService)
  );
  router.put(
    '/warehouses/:id',
    warehouseHttpService.updateWarehouse.bind(warehouseHttpService)
  );
  router.delete(
    '/warehouses/:id',
    warehouseHttpService.deleteWarehouse.bind(warehouseHttpService)
  );
  return router;
}
