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
  async getInventoryByInventoryIdAndWarehouseId(inventory_id: string, warehouse_id: string, t?: Transaction): Promise<InventoryWarehouse> {
    return await this.inventoryWarehouseRepository.getInventoryByInventoryIdAndWarehouseId(inventory_id, warehouse_id, t);
  }

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
    console.log("🚀 ~ InventoryUseCase ~ totalQuantity ~ totalQuantity:", totalQuantity)
    const totalCost = data.inventory_warehouse.reduce((acc, curr) => {
      return acc + Number(curr.cost) * Number(curr.quantity);
    }, 0);
    console.log("🚀 ~ InventoryUseCase ~ totalCost ~ totalCost:", totalCost)
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
    // 4. Update warehouse quantity and cost
    if (this.warehouseUseCase) {
        const updatedWarehouseData = await Promise.all(
          processInventoryWarehouseData.map(async (item) => {
            return await this.warehouseUseCase?.updateWarehouse(
              item.warehouse_id,
              {
                total_quantity: Number(item.quantity),
                total_cost: Number(item.cost) * Number(item.quantity),
              },
              t
            )
          })
        )
        console.log("🚀 ~ InventoryUseCase ~ updatedWarehouseData:", updatedWarehouseData)
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
    const currentInventory = await this.inventoryRepository.get(id);
    // 2. Prepare update payload
    const {inventory_warehouse, ...payload} = data
    // 3. Update inventory warehouse with transaction if provided
    const updatedInventoryInWarehouse =
    await this.inventoryWarehouseRepository.updateInventoryWarehouse(
      inventory_warehouse || [],
      t
    );
    // 4. Update total quantity and total cost
    const totalQuantity = updatedInventoryInWarehouse.reduce((acc, curr) => {
      return acc + Number(curr.quantity);
    }, 0);
    const totalCost = updatedInventoryInWarehouse.reduce((acc, curr) => {
      return acc + Number(curr.cost) * Number(curr.quantity);
    }, 0);
    payload.total_quantity = totalQuantity;
    payload.total_cost = totalCost;
    payload.stock_status = this.determineStockStatus(totalQuantity, currentInventory.low_stock_threshold ?? 0);
    // 5. Update inventory with transaction if provided
    const updatedInventory = await this.inventoryRepository.update(id, payload, t);
    console.log("🚀 ~ InventoryUseCase ~ updatedInventory:", updatedInventory)
    console.log("🚀 ~ InventoryUseCase ~ updatedInventoryInWarehouse:", updatedInventoryInWarehouse)
    return updatedInventory;
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
