import { Transaction } from 'sequelize';
import {
  InventoryConditionDTO,
  InventoryCreateDTO,
  InventoryUpdateDTO,
  InventoryUpdatedType,
  InventoryWarehouseCreateDTO,
  InventoryWarehouseUpdateDTO,
} from 'src/modules/inventory/models/inventory.dto';
import {
  IInventoryRepository,
  IInventoryUseCase,
} from 'src/modules/inventory/models/inventory.interface';
import {
  Inventory,
  InventoryWarehouse,
  StockStatus,
} from 'src/modules/inventory/models/inventory.model';
import { IWarehouseUsecase } from 'src/modules/warehouse/models/warehouse.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class InventoryUseCase implements IInventoryUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly inventoryWarehouseRepository: IInventoryRepository,
    private readonly warehouseUseCase: IWarehouseUsecase
  ) {}

  async updateInventoryWarehouse(
    data: InventoryWarehouseUpdateDTO[],
    t?: Transaction
  ): Promise<InventoryWarehouse[]> {
    return await this.inventoryWarehouseRepository.updateInventoryWarehouse(
      data,
      t
    );
  }

  async getInventoryByInventoryIdAndWarehouseId(
    inventory_id: string,
    warehouse_id: string,
    t?: Transaction
  ): Promise<InventoryWarehouse> {
    return await this.inventoryWarehouseRepository.getInventoryByInventoryIdAndWarehouseId(
      inventory_id,
      warehouse_id,
      t
    );
  }

  async getInventoryById(
    id: string,
    condition?: InventoryConditionDTO,
    t?: Transaction
  ): Promise<Inventory> {
    return await this.inventoryRepository.get(id, condition, t);
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
        data.low_stock_threshold ?? 0,
        data.high_stock_threshold ?? 9999999
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
        total_cost: Number(item.cost) * Number(item.quantity),
      }));
    const createdInventoryWarehouseData =
      await this.inventoryWarehouseRepository.addInventoryWarehouse(
        processInventoryWarehouseData,
        t
      );
    console.log(
      '🚀 ~ InventoryUseCase ~ createdInventoryWarehouseData:',
      createdInventoryWarehouseData
    );
    // 4. Update warehouse quantity and cost
    for (const item of processInventoryWarehouseData) {
      const currentWarehouse = await this.warehouseUseCase?.getWarehouseById(
        item.warehouse_id,
        {},
        t
      );
      console.log(
        '🚀 ~ InventoryUseCase ~ currentWarehouse:',
        currentWarehouse
      );
      await this.warehouseUseCase?.updateWarehouse(
        item.warehouse_id,
        {
          total_quantity:
            currentWarehouse.total_quantity + Number(item.quantity),
          total_cost:
            currentWarehouse.total_cost +
            Number(item.cost) * Number(item.quantity),
        },
        t
      );
    }

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
    const updatedInventory = await this.inventoryRepository.update(id, data, t);
    return updatedInventory;
  }

  private determineStockStatus(
    quantity: number,
    lowStockThreshold: number,
    highStockThreshold: number
  ): StockStatus {
    if (quantity === 0) return StockStatus.OUT_OF_STOCK;
    if (quantity <= lowStockThreshold) return StockStatus.LOW_STOCK;
    if (quantity > highStockThreshold) return StockStatus.OVER_STOCK;
    return StockStatus.IN_STOCK;
  }

  async deleteInventory(id: string): Promise<boolean> {
    return await this.inventoryRepository.delete(id);
  }
}
