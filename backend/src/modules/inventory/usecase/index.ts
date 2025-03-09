import { Transaction } from 'sequelize';
import {
  InventoryConditionDTO,
  InventoryCreateDTO,
  InventoryUpdateDTO,
  InventoryWarehouseCreateDTO,
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
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly inventoryWarehouseRepository: IInventoryRepository
  ) {}
  async getInventoryById(id: string, condition?: InventoryConditionDTO): Promise<Inventory> {
    return await this.inventoryRepository.get(id, condition);
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
    // 1. Calculate total quantity and total cost for inventory
    const totalQuantity = data.inventory_warehouse.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0);
    const totalCost = data.inventory_warehouse.reduce((acc, curr) => {
      return acc + Number(curr.cost) * Number(curr.quantity);
    }, 0);
    // 2. Create Inventory for product sellable
    const processData: InventoryCreateDTO = {
      ...data,
      total_quantity: Number(totalQuantity),
      total_cost: Number(totalCost),
      stock_status: this.determineStockStatus(
        Number(totalQuantity),
        data.low_stock_threshold ?? 0
      ),
    };
    const createdInventory = await this.inventoryRepository.create(
      processData,
      t
    );
    // 3. Create InventoryWarehouse for inventory
    const processInventoryWarehouseData: InventoryWarehouseCreateDTO[] =
      data.inventory_warehouse.map((item) => ({
        ...item,
        inventory_id: createdInventory.id,
      }));
    const createdInventoryWarehouseData =
      await this.inventoryWarehouseRepository.addInventoryWarehouse(
        processInventoryWarehouseData,
        t
      );
    console.log(
      '🚀 ~ InventoryUseCase ~ processInventoryWarehouseData:',
      processInventoryWarehouseData
    );
    console.log(
      '🚀 ~ InventoryUseCase ~ createdInventoryWarehouseData:',
      createdInventoryWarehouseData
    );
    return createdInventory;
  }

  async updateInventory(
    id: string,
    data: InventoryUpdateDTO,
    t?: Transaction
  ): Promise<Inventory> {
    // 1. Get current inventory data
    const currentInventory = await this.inventoryRepository.get(id);
    // 2. Prepare update payload
    const payload: InventoryUpdateDTO = { ...data };
    // 3. Calculate total value using updated or current cost and quantity
    const totalQuantity =
      data?.inventory_warehouse?.reduce((acc, curr) => {
        return acc + (curr.quantity ?? 0);
      }, 0) || data.total_quantity || currentInventory.total_quantity;
    const totalCost =
      data?.inventory_warehouse?.reduce((acc, curr) => {
        return acc + (curr.cost ?? 0);
      }, 0) || data.total_cost || currentInventory.total_cost;
    payload.total_quantity = totalQuantity;
    payload.total_cost = totalCost;
    // 4. Update stock status based on threshold and quantity
    const threshold =
      data.low_stock_threshold ?? currentInventory.low_stock_threshold;
    payload.stock_status = this.determineStockStatus(totalQuantity, threshold);
    // 5. Update inventory with transaction if provided
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
