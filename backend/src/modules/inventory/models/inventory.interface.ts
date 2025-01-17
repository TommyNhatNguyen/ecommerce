import { InventoryConditionDTO, InventoryUpdateDTO } from 'src/modules/inventory/models/inventory.dto';
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
  createInventory(data: InventoryCreateDTO): Promise<Inventory>;
  updateInventory(id: string, data: InventoryUpdateDTO): Promise<Inventory>;
  deleteInventory(id: string): Promise<boolean>;
  updateInventoryStockStatus(
    id: string,
    data: Required<Pick<InventoryUpdateDTO, 'low_stock_threshold'>>
  ): Promise<Inventory>;
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
  create(data: InventoryCreateDTO): Promise<Inventory>;
  update(id: string, data: InventoryUpdateDTO): Promise<Inventory>;
  delete(id: string): Promise<boolean>;
}
