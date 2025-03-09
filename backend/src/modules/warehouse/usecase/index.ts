import { Transaction } from 'sequelize';
import {
  WarehouseCreateDTO,
  WarehouseUpdateDTO,
  WarehouseConditionDTO,
} from 'src/modules/warehouse/models/warehouse.dto';
import { WAREHOUSE_NOT_FOUND } from 'src/modules/warehouse/models/warehouse.errors';
import { IWarehouseRepository } from 'src/modules/warehouse/models/warehouse.interface';

import { IWarehouseUsecase } from 'src/modules/warehouse/models/warehouse.interface';
import { Warehouse } from 'src/modules/warehouse/models/warehouse.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class WarehouseUseCase implements IWarehouseUsecase {
  constructor(private readonly warehouseRepository: IWarehouseRepository) {}
  async createWarehouse(
    data: WarehouseCreateDTO,
    t?: Transaction
  ): Promise<Warehouse> {
    return await this.warehouseRepository.createWarehouse(data, t);
  }
  async updateWarehouse(
    id: string,
    data: WarehouseUpdateDTO,
    t?: Transaction
  ): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.getWarehouseById(
      id,
      {},
      t
    );
    if (!warehouse) {
      throw WAREHOUSE_NOT_FOUND;
    }
    const updatedWarehouse = await this.warehouseRepository.updateWarehouse(
      id,
      data,
      t
    );
    return updatedWarehouse;
  }
  async deleteWarehouse(id: string, t?: Transaction): Promise<boolean> {
    const warehouse = await this.warehouseRepository.getWarehouseById(
      id,
      {},
      t
    );
    if (!warehouse) {
      throw WAREHOUSE_NOT_FOUND;
    }
    return await this.warehouseRepository.deleteWarehouse(id, t);
  }
  async getWarehouseById(
    id: string,
    condition?: WarehouseConditionDTO,
    t?: Transaction
  ): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.getWarehouseById(
      id,
      condition,
      t
    );
    if (!warehouse) {
      throw WAREHOUSE_NOT_FOUND;
    }
    return warehouse;
  }
  async getWarehouseList(
    paging: PagingDTO,
    condition?: WarehouseConditionDTO
  ): Promise<ListResponse<Warehouse[]>> {
    return await this.warehouseRepository.getWarehouseList(paging, condition);
  }
}
