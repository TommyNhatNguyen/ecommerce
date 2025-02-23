import { Transaction } from 'sequelize';
import {
  InventoryConditionDTO,
  InventoryCreateDTO,
  InventoryUpdateDTO,
} from 'src/modules/inventory/models/inventory.dto';
import {
  IInventoryRepository,
  IInventoryUseCase,
} from 'src/modules/inventory/models/inventory.interface';
import {
  Inventory,
  StockStatus,
} from 'src/modules/inventory/models/inventory.model';
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

  async createInventory(
    data: InventoryCreateDTO,
    t?: Transaction
  ): Promise<Inventory> {
    const createdInventory = await this.inventoryRepository.create(data, t);
    return await this.updateInventoryStockStatus(
      createdInventory.id,
      {
        quantity: data.quantity,
        low_stock_threshold: data.low_stock_threshold,
      },
      t
    );
  }

  async updateInventoryQuantity(
    productSellableId: string,
    data: Required<Pick<InventoryUpdateDTO, 'quantity'>>,
    t?: Transaction
  ): Promise<Inventory> {
    // Update inventory quantity
    const updatedInventory =
      await this.inventoryRepository.updateInventoryQuantity(
        productSellableId,
        data,
        t
      );
    // Update inventory stock status
    await this.updateInventoryStockStatus(
      updatedInventory.id,
      {
        quantity: updatedInventory.quantity,
        low_stock_threshold: updatedInventory.low_stock_threshold,
        total_value: updatedInventory.cost * updatedInventory.quantity,
      },
      t
    );
    return updatedInventory;
  }

  async updateInventoryStockStatus(
    id: string,
    data: Pick<
      InventoryUpdateDTO,
      'low_stock_threshold' | 'quantity' | 'cost' | 'total_value'
    >,
    t?: Transaction
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
    if (t) {
      return await this.inventoryRepository.update(id, payload, t);
    }
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
