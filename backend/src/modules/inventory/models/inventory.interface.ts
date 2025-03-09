import { Transaction } from 'sequelize';
import {
  InventoryConditionDTO,
  InventoryUpdateDTO,
  InventoryWarehouseCreateDTO,
  InventoryWarehouseUpdateDTO,
} from 'src/modules/inventory/models/inventory.dto';
import { InventoryCreateDTO } from 'src/modules/inventory/models/inventory.dto';
import { Inventory, InventoryWarehouse } from 'src/modules/inventory/models/inventory.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IInventoryUseCase {
  getInventoryById(id: string, condition?: InventoryConditionDTO): Promise<Inventory>;
  getInventoryList(
    paging: PagingDTO,
    condition: InventoryConditionDTO
  ): Promise<ListResponse<Inventory[]>>;
  createInventory(
    data: InventoryCreateDTO,
    t?: Transaction
  ): Promise<Inventory>;
  updateInventory(
    id: string,
    data: InventoryUpdateDTO,
    t?: Transaction
  ): Promise<Inventory>;
  deleteInventory(id: string, t?: Transaction): Promise<boolean>;
}

export interface IInventoryRepository
  extends IQueryRepository,
    ICommandRepository {
  addInventoryWarehouse(
    data: InventoryWarehouseCreateDTO[],
    t?: Transaction
  ): Promise<InventoryWarehouse[]>;
  updateInventoryWarehouse(
    data: InventoryWarehouseUpdateDTO[],
    t?: Transaction
  ): Promise<InventoryWarehouse[]>;
  deleteInventoryWarehouse(
    inventory_id: string,
    warehouse_id: string,
    t?: Transaction
  ): Promise<boolean>;
}

export interface IQueryRepository {
  get(id: string, condition?: InventoryConditionDTO): Promise<Inventory>;
  list(
    paging: PagingDTO,
    condition: InventoryConditionDTO
  ): Promise<ListResponse<Inventory[]>>;
}

export interface ICommandRepository {
  create(data: InventoryCreateDTO, t?: Transaction): Promise<Inventory>;
  update(
    id: string,
    data: InventoryUpdateDTO,
    t?: Transaction
  ): Promise<Inventory>;
  delete(id: string, t?: Transaction): Promise<boolean>;
}
