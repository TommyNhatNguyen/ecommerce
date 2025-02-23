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
    // Create inventory
    const processData: InventoryCreateDTO = {
      ...data,
      total_value: data.cost * data.quantity,
      stock_status: this.determineStockStatus(
        data.quantity ?? 0,
        data.low_stock_threshold ?? 0
      ),
    };
    const createdInventory = await this.inventoryRepository.create(
      processData,
      t
    );
    return createdInventory;
  }

  async updateInventory(
    id: string,
    data: InventoryUpdateDTO,
    t?: Transaction
  ): Promise<Inventory> {
    // Get current inventory data
    const currentInventory = await this.inventoryRepository.get(id);

    // Prepare update payload
    const payload: InventoryUpdateDTO = { ...data };

    // 1. Calculate total value using updated or current cost and quantity
    const quantity = data.quantity ?? currentInventory.quantity;
    const cost = data.cost ?? currentInventory.cost;
    payload.total_value = cost * quantity;

    // 2. Update stock status based on threshold and quantity
    const threshold =
      data.low_stock_threshold ?? currentInventory.low_stock_threshold;
    payload.stock_status = this.determineStockStatus(quantity, threshold);

    // Update inventory with transaction if provided
    return await this.inventoryRepository.update(id, payload, t);
  }

  private determineStockStatus(
    quantity: number,
    lowStockThreshold: number
  ): StockStatus {
    if (quantity === 0) return StockStatus.OUT_OF_STOCK;
    if (quantity <= lowStockThreshold) return StockStatus.LOW_STOCK;
    return StockStatus.IN_STOCK;
  }

  async deleteInventory(id: string): Promise<boolean> {
    return await this.inventoryRepository.delete(id);
  }
}
