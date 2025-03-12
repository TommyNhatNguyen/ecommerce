import { Sequelize } from 'sequelize';
import { Transaction } from 'sequelize';
import { IInventoryUseCase } from 'src/modules/inventory/models/inventory.interface';
import {
  InventoryInvoiceConditionDTO,
  InventoryInvoiceCreateDTO,
  InventoryInvoiceUpdateDTO,
} from 'src/modules/inventory_invoices/models/inventory_invoices.dto';
import { INVENTORY_INVOICE_NOT_FOUND } from 'src/modules/inventory_invoices/models/inventory_invoices.errors';
import {
  IInventoryInvoiceRepository,
  IInventoryInvoiceUseCase,
} from 'src/modules/inventory_invoices/models/inventory_invoices.interface';
import {
  InventoryInvoice,
  InventoryInvoiceType,
} from 'src/modules/inventory_invoices/models/inventory_invoices.model';
import { IWarehouseUsecase } from 'src/modules/warehouse/models/warehouse.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class InventoryInvoiceUseCase implements IInventoryInvoiceUseCase {
  constructor(
    private readonly inventoryInvoiceRepository: IInventoryInvoiceRepository,
    private readonly inventoryUseCase?: IInventoryUseCase,
    private readonly warehouseUseCase?: IWarehouseUsecase,
    private readonly sequelize?: Sequelize
  ) {}
  async getById(
    id: string,
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<InventoryInvoice> {
    const inventoryInvoice = await this.inventoryInvoiceRepository.getById(
      id,
      condition,
      t
    );
    if (!inventoryInvoice) {
      throw INVENTORY_INVOICE_NOT_FOUND;
    }
    return inventoryInvoice;
  }
  async getList(
    paging: PagingDTO,
    condition?: InventoryInvoiceConditionDTO
  ): Promise<ListResponse<InventoryInvoice[]>> {
    const inventoryInvoices = await this.inventoryInvoiceRepository.getList(
      paging,
      condition
    );
    return inventoryInvoices;
  }
  async getAll(
    condition?: InventoryInvoiceConditionDTO,
    t?: Transaction
  ): Promise<ListResponse<InventoryInvoice[]>> {
    const inventoryInvoices = await this.inventoryInvoiceRepository.getAll(
      condition,
      t
    );
    return inventoryInvoices;
  }
  async create(
    data: InventoryInvoiceCreateDTO,
    t?: Transaction
  ): Promise<InventoryInvoice | null> {
    try {
      const result = await this.sequelize?.transaction(async (t) => {
        let inventoryInvoice;
        let inventory_id = data?.inventory_id || '';
        let warehouse_id = data?.warehouse_id || '';
        let quantity = data?.quantity || 0;
        let cost = data?.cost || 0;
        let amount = quantity * cost;
        let code =
          data?.code ||
          `IMPORT-INV-${data?.type}-${Math.random()
            .toString(36)
            .substring(2, 15)}`;
        // 1. Lấy data: cập nhật cái gì, ở kho nào, số lượng bao nhiêu, note là gì
        const inventoryWarehouse =
          await this.inventoryUseCase?.getInventoryByInventoryIdAndWarehouseId(
            inventory_id,
            warehouse_id,
            t
          );
        const inventory = await this.inventoryUseCase?.getInventoryById(
          inventory_id,
          {},
          t
        );
        const warehouse = await this.warehouseUseCase?.getWarehouseById(
          warehouse_id,
          {},
          t
        );
        if (data.type == InventoryInvoiceType.IMPORT_INVOICE) {
          inventoryInvoice = await this.inventoryInvoiceRepository.create(
            {
              ...data,
              quantity: quantity,
              cost: cost,
              amount: amount,
              inventory_id: inventory_id,
              warehouse_id: warehouse_id,
              code: code,
            },
            t
          );
          // 2. Cập nhật theo inventory và warehouse: quantity, total_cost, cost (tính trung bình)
          const inventoryWareHouseUpdatedQuantity =
            (inventoryWarehouse?.quantity || 0) + quantity;
          const inventoryWareHouseUpdatedTotalCost =
            (inventoryWarehouse?.total_cost || 0) + amount;
          const inventoryWareHouseUpdatedCost =
            inventoryWareHouseUpdatedTotalCost /
            inventoryWareHouseUpdatedQuantity;
          await this.inventoryUseCase?.updateInventoryWarehouse(
            [
              {
                inventory_id: inventory_id,
                warehouse_id: warehouse_id,
                quantity: inventoryWareHouseUpdatedQuantity,
                total_cost: inventoryWareHouseUpdatedTotalCost,
                cost: inventoryWareHouseUpdatedCost,
              },
            ],
            t
          );
          // 3. Cập nhật inventory tổng
          const inventoryUpdatedTotalQuantity =
            (inventory?.total_quantity || 0) + quantity;
          const inventoryUpdatedTotalCost =
            (inventory?.total_cost || 0) + amount;
          const inventoryUpdatedAvgCost =
            inventoryUpdatedTotalCost / inventoryUpdatedTotalQuantity;
          await this.inventoryUseCase?.updateInventory(
            inventory_id,
            {
              total_quantity: inventoryUpdatedTotalQuantity,
              total_cost: inventoryUpdatedTotalCost,
              avg_cost: inventoryUpdatedAvgCost,
            },
            t
          );
          // 4. Cập nhật warehouse tổng
          const warehouseUpdatedTotalQuantity =
            (warehouse?.total_quantity || 0) + quantity;
          const warehouseUpdatedTotalCost =
            (warehouse?.total_cost || 0) + amount;
          await this.warehouseUseCase?.updateWarehouse(
            warehouse_id,
            {
              total_quantity: warehouseUpdatedTotalQuantity,
              total_cost: warehouseUpdatedTotalCost,
            },
            t
          );
        } else if (data.type == InventoryInvoiceType.DISCARD_INVOICE) {
          // 2. Cập nhật theo inventory và warehouse: quantity, total_cost, cost (tính trung bình)
          cost = inventoryWarehouse?.cost || 0;
          amount = quantity * cost;
          code =
            data?.code ||
            `DISCARD-INV-${Math.random().toString(36).substring(2, 15)}`;
          inventoryInvoice = await this.inventoryInvoiceRepository.create(
            {
              ...data,
              quantity: quantity,
              cost: cost,
              amount: amount,
              inventory_id: inventory_id,
              warehouse_id: warehouse_id,
              code: code,
            },
            t
          );
          // 2. Cập nhật theo inventory và warehouse: quantity, total_cost, cost (tính trung bình)
          const inventoryWareHouseUpdatedQuantity =
            (inventoryWarehouse?.quantity || 0) - quantity;
          const inventoryWareHouseUpdatedTotalCost =
            (inventoryWarehouse?.total_cost || 0) - amount;
          const inventoryWareHouseUpdatedCost =
            inventoryWareHouseUpdatedTotalCost /
            inventoryWareHouseUpdatedQuantity;
          await this.inventoryUseCase?.updateInventoryWarehouse(
            [
              {
                inventory_id: inventory_id,
                warehouse_id: warehouse_id,
                quantity: inventoryWareHouseUpdatedQuantity,
                total_cost: inventoryWareHouseUpdatedTotalCost,
                cost: inventoryWareHouseUpdatedCost,
              },
            ],
            t
          );
          // 3. Cập nhật inventory tổng
          const inventoryUpdatedTotalQuantity =
            (inventory?.total_quantity || 0) - quantity;
          const inventoryUpdatedTotalCost =
            (inventory?.total_cost || 0) - amount;
          const inventoryUpdatedAvgCost =
            inventoryUpdatedTotalCost / inventoryUpdatedTotalQuantity;
          await this.inventoryUseCase?.updateInventory(
            inventory_id,
            {
              total_quantity: inventoryUpdatedTotalQuantity,
              total_cost: inventoryUpdatedTotalCost,
              avg_cost: inventoryUpdatedAvgCost,
            },
            t
          );
          // 4. Cập nhật warehouse tổng
          const warehouseUpdatedTotalQuantity =
            (warehouse?.total_quantity || 0) - quantity;
          const warehouseUpdatedTotalCost =
            (warehouse?.total_cost || 0) - amount;
          await this.warehouseUseCase?.updateWarehouse(
            warehouse_id,
            {
              total_quantity: warehouseUpdatedTotalQuantity,
              total_cost: warehouseUpdatedTotalCost,
            },
            t
          );
        } else if (data.type == InventoryInvoiceType.UPDATE_COST_INVOICE) {
          cost = data?.cost || 0;
          quantity = inventoryWarehouse?.quantity || 0;
          amount = quantity * cost;
          code =
            data?.code ||
            `UPDATE-COST-INV-${Math.random().toString(36).substring(2, 15)}`;
          inventoryInvoice = await this.inventoryInvoiceRepository.create(
            {
              ...data,
              quantity: quantity,
              cost: cost,
              amount: amount,
              inventory_id: inventory_id,
              warehouse_id: warehouse_id,
              code: code,
            },
            t
          );
          // 2. Cập nhật theo inventory và warehouse: quantity, total_cost, cost (tính trung bình)
          const diffCost = cost - (inventoryWarehouse?.cost || 0);
          const diffTotalCost = diffCost * quantity;
          const inventoryWareHouseUpdatedQuantity =
            inventoryWarehouse?.quantity || 0;
          const inventoryWareHouseUpdatedTotalCost =
            (inventoryWarehouse?.total_cost || 0) + diffTotalCost;
          const inventoryWareHouseUpdatedCost = cost;
          await this.inventoryUseCase?.updateInventoryWarehouse(
            [
              {
                inventory_id: inventory_id,
                warehouse_id: warehouse_id,
                quantity: inventoryWareHouseUpdatedQuantity,
                total_cost: inventoryWareHouseUpdatedTotalCost,
                cost: inventoryWareHouseUpdatedCost,
              },
            ],
            t
          );
          // 3. Cập nhật inventory tổng
          const inventoryUpdatedTotalQuantity = inventory?.total_quantity || 0;
          const inventoryUpdatedTotalCost =
            (inventory?.total_cost || 0) + diffTotalCost;
          const inventoryUpdatedAvgCost =
            inventoryUpdatedTotalCost / inventoryUpdatedTotalQuantity;
          await this.inventoryUseCase?.updateInventory(
            inventory_id,
            {
              total_quantity: inventoryUpdatedTotalQuantity,
              total_cost: inventoryUpdatedTotalCost,
              avg_cost: inventoryUpdatedAvgCost,
            },
            t
          );
          // 4. Cập nhật warehouse tổng
          const warehouseUpdatedTotalQuantity = warehouse?.total_quantity || 0;
          const warehouseUpdatedTotalCost =
            (warehouse?.total_cost || 0) + diffTotalCost;
          await this.warehouseUseCase?.updateWarehouse(
            warehouse_id,
            {
              total_quantity: warehouseUpdatedTotalQuantity,
              total_cost: warehouseUpdatedTotalCost,
            },
            t
          );
        }
        return inventoryInvoice;
      });
      return result || null;
    } catch (error) {
      console.log('🚀 ~ ProductUseCase ~ createNewProduct ~ error:', error);
      throw error;
    }
  }
  async update(
    id: string,
    data: InventoryInvoiceUpdateDTO,
    t?: Transaction
  ): Promise<InventoryInvoice> {
    const inventoryInvoice = await this.inventoryInvoiceRepository.update(
      id,
      data,
      t
    );
    return inventoryInvoice;
  }
  async delete(id: string, t?: Transaction): Promise<boolean> {
    const inventoryInvoice = await this.inventoryInvoiceRepository.delete(
      id,
      t
    );
    return inventoryInvoice;
  }
}
