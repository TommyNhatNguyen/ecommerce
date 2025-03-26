import { Sequelize } from 'sequelize';
import { Transaction } from 'sequelize';
import { IInventoryUseCase } from 'src/modules/inventory/models/inventory.interface';
import {
  InventoryInvoiceConditionDTO,
  InventoryInvoiceCreateCheckInventoryDTO,
  InventoryInvoiceCreateDTO,
  InventoryInvoiceCreateTransferDTO,
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

  async createCheckInventoryInvoice(
    data: InventoryInvoiceCreateCheckInventoryDTO,
    t?: Transaction
  ): Promise<InventoryInvoice | null> {
    try {
      const result = await this.sequelize?.transaction(async (t) => {
        let inventoryInvoice;
        let diffAmmount = 0;
        let diffQuantity = 0;
        let code =
          data?.code ||
          `CHECK-INV-${Math.random().toString(36).substring(2, 15)}`;
        // 1. Lấy data của warehouse
        const warehouse = await this.warehouseUseCase?.getWarehouseById(
          data?.warehouse_id || '',
          {},
          t
        );
        // 2. Bắt đầu lặp qua inventory_data để kiểm tra
        for (const [index, inventory] of data.inventory_data.entries()) {
          // 2.1. Lấy data của inventory
          const inventoryData = await this.inventoryUseCase?.getInventoryById(
            inventory.inventory_id,
            {},
            t
          );
          // 2.2. Lấy data của inventory warehouse
          const inventoryWarehouse =
            await this.inventoryUseCase?.getInventoryByInventoryIdAndWarehouseId(
              inventory.inventory_id,
              data.warehouse_id,
              t
            );
          // 2.3. Cập nhật inventory warehouse
          let diffQuantityInventoryWarehouse =
            (inventoryWarehouse?.quantity || 0) -
            (inventory.actual_quantity || 0);
          let updatedTotalCostInventoryWarehouse =
            (inventory.actual_quantity || 0) * (inventoryWarehouse?.cost || 0);
          let diffTotalCostInventoryWarehouse =
            (inventoryWarehouse?.total_cost || 0) -
            updatedTotalCostInventoryWarehouse;
          let updatedInventoryWarehouseCost =
            updatedTotalCostInventoryWarehouse /
            (inventory.actual_quantity || 0);
          diffQuantity += diffQuantityInventoryWarehouse;
          diffAmmount += diffTotalCostInventoryWarehouse;
          this.inventoryUseCase?.updateInventoryWarehouse(
            [
              {
                inventory_id: inventory.inventory_id,
                warehouse_id: data.warehouse_id,
                quantity: inventory.actual_quantity,
                total_cost: updatedTotalCostInventoryWarehouse,
                cost: updatedInventoryWarehouseCost,
              },
            ],
            t
          );
          // 2.4. Cập nhật inventory tổng
          let updatedTotalQuantityInventory =
            (inventoryData?.total_quantity || 0) -
            diffQuantityInventoryWarehouse;
          let updatedTotalCostInventory =
            (inventoryData?.total_cost || 0) -
            diffQuantityInventoryWarehouse *
              (inventoryWarehouse?.cost || inventoryData?.avg_cost || 0);
          let updatedAvgCostInventory =
            updatedTotalCostInventory / updatedTotalQuantityInventory;
          await this.inventoryUseCase?.updateInventory(
            inventory.inventory_id,
            {
              total_quantity: updatedTotalQuantityInventory,
              total_cost: updatedTotalCostInventory,
              avg_cost: updatedAvgCostInventory,
            },
            t
          );
          // 2.5. Cập nhật warehouse tổng
          let updatedTotalQuantityWarehouse =
            (warehouse?.total_quantity || 0) - diffQuantityInventoryWarehouse;
          let updatedTotalCostWarehouse =
            (warehouse?.total_cost || 0) -
            diffQuantityInventoryWarehouse *
              (inventoryWarehouse?.cost || inventoryData?.avg_cost || 0);
          await this.warehouseUseCase?.updateWarehouse(
            data.warehouse_id,
            {
              total_quantity: updatedTotalQuantityWarehouse,
              total_cost: updatedTotalCostWarehouse,
            },
            t
          );
        }
        // 3. Tạo invoice
        inventoryInvoice = await this.inventoryInvoiceRepository.create(
          {
            type: InventoryInvoiceType.CHECK_INVENTORY_INVOICE,
            inventory_id: data.inventory_data[0].inventory_id,
            warehouse_id: data.warehouse_id,
            quantity: diffQuantity,
            amount: diffAmmount,
            cost: diffAmmount / diffQuantity,
            note: data.note,
            code: code,
          },
          t
        );
        return inventoryInvoice;
      });

      return result || null;
    } catch (error) {
      console.log(
        '🚀 ~ InventoryInvoiceUseCase ~ createTransferInvoice ~ error:',
        error
      );
      throw error;
    }
  }

  async createTransferInvoice(
    data: InventoryInvoiceCreateTransferDTO,
    t?: Transaction
  ): Promise<InventoryInvoice | null> {
    try {
      const result = await this.sequelize?.transaction(async (t) => {
        let inventoryInvoice;
        let inventory_id = data?.inventory_id || '';
        let warehouse_id_from = data?.warehouse_id_from || '';
        let warehouse_id_to = data?.warehouse_id_to || '';
        let quantity = data?.quantity || 0;
        if (quantity <= 0) {
          throw new Error('Quantity must be greater than 0');
        }
        let code =
          data?.code ||
          `TRANSFER-INV-${Math.random().toString(36).substring(2, 15)}`;
        // 1. Lấy data: cập nhật cái gì, ở kho nào, số lượng bao nhiêu, note là gì
        const inventoryWarehouseFrom =
          await this.inventoryUseCase?.getInventoryByInventoryIdAndWarehouseId(
            inventory_id,
            warehouse_id_from,
            t
          );
        const inventoryWarehouseTo =
          await this.inventoryUseCase?.getInventoryByInventoryIdAndWarehouseId(
            inventory_id,
            warehouse_id_to,
            t
          );
        const warehouseFrom = await this.warehouseUseCase?.getWarehouseById(
          warehouse_id_from,
          {},
          t
        );
        const warehouseTo = await this.warehouseUseCase?.getWarehouseById(
          warehouse_id_to,
          {},
          t
        );
        // 3. Cập nhật total_quantity và total_cost của warehouse
        const warehouseFromUpdatedTotalQuantity =
          (warehouseFrom?.total_quantity || 0) - quantity;
        const warehouseFromUpdatedTotalCost =
          (warehouseFrom?.total_cost || 0) -
          (data?.quantity || 0) * (inventoryWarehouseFrom?.cost || 0);
        const warehouseToUpdatedTotalQuantity =
          (warehouseTo?.total_quantity || 0) + quantity;
        const warehouseToUpdatedTotalCost =
          (warehouseTo?.total_cost || 0) +
          (data?.quantity || 0) *
            (inventoryWarehouseTo?.cost || inventoryWarehouseFrom?.cost || 0);
        console.log(
          '🚀 ~ InventoryInvoiceUseCase ~ result ~ warehouseFromUpdatedTotalCost:',
          inventoryWarehouseFrom,
          inventoryWarehouseTo
        );
        const warehouseUpdatedList = await Promise.all([
          this.warehouseUseCase?.updateWarehouse(
            warehouse_id_from,
            {
              total_quantity: warehouseFromUpdatedTotalQuantity,
              total_cost: warehouseFromUpdatedTotalCost,
            },
            t
          ),
          this.warehouseUseCase?.updateWarehouse(
            warehouse_id_to,
            {
              total_quantity: warehouseToUpdatedTotalQuantity,
              total_cost: warehouseToUpdatedTotalCost,
            },
            t
          ),
        ]);
        // 2. Cập nhật inventory warehouse từ kho này sang kho khác
        let diffQuantityInventoryWarehouseFrom =
          (inventoryWarehouseFrom?.quantity || 0) - (data?.quantity || 0);
        let diffQuantityInventoryWarehouseTo =
          (inventoryWarehouseTo?.quantity || 0) + (data?.quantity || 0);
        let diffTotalCostInventoryWarehouseFrom =
          (inventoryWarehouseFrom?.total_cost || 0) -
          (data?.quantity || 0) * (inventoryWarehouseFrom?.cost || 0);
        let diffTotalCostInventoryWarehouseTo =
          (inventoryWarehouseTo?.total_cost || 0) +
          (data?.quantity || 0) * (inventoryWarehouseTo?.cost || 0);
        let updatedInventoryWarehouseFromCost =
          diffTotalCostInventoryWarehouseFrom /
          diffQuantityInventoryWarehouseFrom;
        let updatedInventoryWarehouseToCost =
          diffTotalCostInventoryWarehouseTo / diffQuantityInventoryWarehouseTo;
        if (!inventoryWarehouseTo) {
          await this.inventoryUseCase?.addInventoryWarehouse(
            [
              {
                inventory_id: inventory_id,
                warehouse_id: warehouse_id_to,
                quantity: diffQuantityInventoryWarehouseTo,
                total_cost:
                  (data?.quantity || 0) * (inventoryWarehouseFrom?.cost || 0),
                cost: inventoryWarehouseFrom?.cost || 0,
              },
            ],
            t
          );
          if (diffQuantityInventoryWarehouseFrom <= 0) {
            await this.inventoryUseCase?.deleteInventoryWarehouse(
              inventory_id,
              warehouse_id_from,
              t
            );
          } else {
            await this.inventoryUseCase?.updateInventoryWarehouse(
              [
                {
                  inventory_id: inventory_id,
                  warehouse_id: warehouse_id_from,
                  quantity: diffQuantityInventoryWarehouseFrom,
                  total_cost: diffTotalCostInventoryWarehouseFrom,
                  cost: updatedInventoryWarehouseFromCost || 0,
                },
              ],
              t
            );
          }
        } else {
          if (diffQuantityInventoryWarehouseFrom <= 0) {
            await this.inventoryUseCase?.deleteInventoryWarehouse(
              inventory_id,
              warehouse_id_from,
              t
            );
            await this.inventoryUseCase?.updateInventoryWarehouse(
              [
                {
                  inventory_id: inventory_id,
                  warehouse_id: warehouse_id_to,
                  quantity: diffQuantityInventoryWarehouseTo,
                  total_cost: diffTotalCostInventoryWarehouseTo,
                  cost: updatedInventoryWarehouseToCost || 0,
                },
              ],
              t
            );
          } else {
            await this.inventoryUseCase?.updateInventoryWarehouse(
              [
                {
                  inventory_id: inventory_id,
                  warehouse_id: warehouse_id_from,
                  quantity: diffQuantityInventoryWarehouseFrom,
                  total_cost: diffTotalCostInventoryWarehouseFrom,
                  cost: updatedInventoryWarehouseFromCost || 0,
                },
                {
                  inventory_id: inventory_id,
                  warehouse_id: warehouse_id_to,
                  quantity: diffQuantityInventoryWarehouseTo,
                  total_cost: diffTotalCostInventoryWarehouseTo,
                  cost: updatedInventoryWarehouseToCost || 0,
                },
              ],
              t
            );
          }
        }
        // 4. Tạo invoice
        const amount = quantity * (inventoryWarehouseFrom?.cost || 0);
        inventoryInvoice = await this.inventoryInvoiceRepository.create(
          {
            type: InventoryInvoiceType.TRANSFER_INVOICE,
            inventory_id: inventory_id,
            warehouse_id: warehouse_id_from,
            quantity: quantity,
            cost: inventoryWarehouseFrom?.cost || 0,
            amount: amount,
            code: code,
          },
          t
        );
        return inventoryInvoice;
      });

      return result || null;
    } catch (error) {
      console.log(
        '🚀 ~ InventoryInvoiceUseCase ~ createTransferInvoice ~ error:',
        error
      );
      throw error;
    }
  }
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
          if (!inventoryWarehouse) {
            await this.inventoryUseCase?.addInventoryWarehouse(
              [
                {
                  inventory_id: inventory_id,
                  warehouse_id: warehouse_id,
                  quantity: quantity,
                  cost: cost,
                  total_cost: amount,
                },
              ],
              t
            );
          } else {
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
          }
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
          if (inventoryWareHouseUpdatedQuantity <= 0) {
            await this.inventoryUseCase?.deleteInventoryWarehouse(
              inventory_id,
              warehouse_id,
              t
            );
          } else {
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
          }
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
