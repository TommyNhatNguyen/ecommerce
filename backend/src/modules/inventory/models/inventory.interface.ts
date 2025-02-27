import { Transaction } from 'sequelize';
import {
  InventoryConditionDTO,
  InventoryUpdateDTO,
} from 'src/modules/inventory/models/inventory.dto';
import { InventoryCreateDTO } from 'src/modules/inventory/models/inventory.dto';
import { Inventory } from 'src/modules/inventory/models/inventory.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IInventoryUseCase {
  getInventoryById(id: string): Promise<Inventory>;
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
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string): Promise<Inventory>;
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
