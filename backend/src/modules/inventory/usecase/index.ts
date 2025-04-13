import { InventoryInvoiceUseCase } from 'src/modules/inventory_invoices/usecase';
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
import { InventoryInvoiceCreateDTO } from 'src/modules/inventory_invoices/models/inventory_invoices.dto';
import { InventoryInvoiceType } from 'src/modules/inventory_invoices/models/inventory_invoices.model';

export class InventoryUseCase implements IInventoryUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly inventoryWarehouseRepository: IInventoryRepository,
    private readonly inventoryInvoiceUseCase?: InventoryInvoiceUseCase,
    private readonly warehouseUseCase?: IWarehouseUsecase
  ) {}

  async deleteInventoryWarehouse(
    inventory_id: string,
    warehouse_id: string,
    t?: Transaction
  ): Promise<boolean> {
    return await this.inventoryWarehouseRepository.deleteInventoryWarehouse(
      inventory_id,
      warehouse_id,
      t
    );
  }

  async updateInventoryWarehouse(
    data: InventoryWarehouseUpdateDTO[],
    t?: Transaction
  ): Promise<InventoryWarehouse[]> {
    return await this.inventoryWarehouseRepository.updateInventoryWarehouse(
      data,
      t
    );
  }

  async addInventoryWarehouse(
    data: InventoryWarehouseCreateDTO[],
    t?: Transaction
  ): Promise<InventoryWarehouse[]> {
    return await this.inventoryWarehouseRepository.addInventoryWarehouse(
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
    const avgCost = totalCost / totalQuantity;
    // 2. Create Inventory for product sellable
    const processData: InventoryCreateDTO = {
      ...data,
      total_quantity: Number(totalQuantity),
      total_cost: Number(totalCost),
      avg_cost: Number(avgCost),
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
            (currentWarehouse?.total_quantity || 0) + Number(item.quantity),
          total_cost:
            (currentWarehouse?.total_cost || 0) +
            Number(item.cost) * Number(item.quantity),
        },
        t
      );
      // --- INVENTORY INVOICE ---
      const inventoryInvoicePayload: InventoryInvoiceCreateDTO = {
        code: `NEW-INV-${Math.random().toString(36).substring(2, 15)}`,
        inventory_id: createdInventory.id,
        type: InventoryInvoiceType.IMPORT_INVOICE,
        quantity: Number(item.quantity),
        amount: Number(item.cost) * Number(item.quantity),
        note: `New inventory created at ${new Date().toISOString()}`,
        warehouse_id: item.warehouse_id,
      };
      await this.inventoryInvoiceUseCase?.create(inventoryInvoicePayload, t);
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
    const inventory = await this.inventoryRepository.get(id, {}, t);
    const payload: InventoryUpdateDTO = { ...data };
    console.log('🚀 ~ InventoryUseCase ~ inventory:', inventory);
    if (data.total_quantity) {
      payload.stock_status = this.determineStockStatus(
        data?.total_quantity,
        inventory?.low_stock_threshold ?? 0,
        inventory?.high_stock_threshold ?? 9999999
      );
    }
    if (data.low_stock_threshold) {
      payload.stock_status = this.determineStockStatus(
        inventory?.total_quantity,
        data.low_stock_threshold ?? 0,
        inventory?.high_stock_threshold ?? 9999999
      );
    }
    if (data.high_stock_threshold) {
      payload.stock_status = this.determineStockStatus(
        inventory?.total_quantity,
        inventory.low_stock_threshold ?? 0,
        data.high_stock_threshold ?? 9999999
      );
    }
    const updatedInventory = await this.inventoryRepository.update(
      id,
      payload,
      t
    );
    return updatedInventory;
  }

  private determineStockStatus(
    quantity: number,
    lowStockThreshold: number,
    highStockThreshold: number
  ): StockStatus {
    console.log(
      '🚀 ~ InventoryUseCase ~ quantity:',
      quantity,
      lowStockThreshold,
      highStockThreshold
    );
    if (quantity === 0) {
      return StockStatus.OUT_OF_STOCK;
    } else if (quantity <= lowStockThreshold) {
      return StockStatus.LOW_STOCK;
    } else if (quantity > highStockThreshold) {
      return StockStatus.OVER_STOCK;
    } else {
      return StockStatus.IN_STOCK;
    }
  }

  async deleteInventory(id: string): Promise<boolean> {
    return await this.inventoryRepository.delete(id);
  }
}
