import {
  InventoryConditionDTO,
  InventoryCreateDTO,
  InventoryUpdateDTO,
} from '@models/inventory/inventory.dto';
import {
  IInventoryRepository,
  IInventoryUseCase,
} from '@models/inventory/inventory.interface';
import { Inventory, StockStatus } from '@models/inventory/inventory.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class InventoryUseCase implements IInventoryUseCase {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}
  async getInventoryById(id: string): Promise<Inventory> {
    return await this.inventoryRepository.get(id);
  }

  async getInventoryList(
    paging: PagingDTO,
    condition: InventoryConditionDTO
  ): Promise<ListResponse<Inventory[]>> {
    return await this.inventoryRepository.list(paging, condition);
  }

  async createInventory(data: InventoryCreateDTO): Promise<Inventory> {
    const createdInventory = await this.inventoryRepository.create(data);
    return await this.updateInventoryStockStatus(createdInventory.id, {
      quantity: data.quantity,
      low_stock_threshold: data.low_stock_threshold,
    });
  }

  async updateInventoryStockStatus(
    id: string,
    data: Pick<InventoryUpdateDTO, 'low_stock_threshold' | 'quantity' | 'cost'>
  ): Promise<Inventory> {
    const payload: InventoryUpdateDTO = { ...data };
    const updatedInventory = await this.inventoryRepository.get(id);
    const determineStockStatus = (
      quantity: number,
      low_stock_threshold: number
    ) => {
      if (quantity === 0) return StockStatus.OUT_OF_STOCK;
      if (quantity <= low_stock_threshold) return StockStatus.LOW_STOCK;
      return StockStatus.IN_STOCK;
    };
    const threshold =
      data.low_stock_threshold ?? updatedInventory.low_stock_threshold;
    const quantity = data.quantity ?? updatedInventory.quantity;
    payload.stock_status = determineStockStatus(quantity, threshold);
    return await this.inventoryRepository.update(id, payload);
  }

  async updateInventory(
    id: string,
    data: InventoryUpdateDTO
  ): Promise<Inventory> {
    return await this.updateInventoryStockStatus(id, {
      low_stock_threshold: data.low_stock_threshold,
      quantity: data.quantity,
      cost: data.cost,
    });
  }

  async deleteInventory(id: string): Promise<boolean> {
    return await this.inventoryRepository.delete(id);
  }
}
