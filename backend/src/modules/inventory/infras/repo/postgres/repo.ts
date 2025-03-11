import { Includeable, Sequelize } from 'sequelize';
import { IInventoryRepository } from 'src/modules/inventory/models/inventory.interface';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  Inventory,
  InventoryWarehouse,
} from 'src/modules/inventory/models/inventory.model';
import {
  InventoryConditionDTO,
  InventoryCreateDTO,
  InventoryUpdateDTO,
  InventoryWarehouseCreateDTO,
  InventoryWarehouseUpdateDTO,
} from 'src/modules/inventory/models/inventory.dto';
import { Transaction } from 'sequelize';
import { productSellableModelName } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { ProductSellablePersistence } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import {
  variantModelName,
  VariantPersistence,
} from 'src/modules/variant/infras/repo/postgres/dto';
import { inventoryWarehouseModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventoryWarehousePersistence } from 'src/modules/inventory/infras/repo/postgres/dto';
import {
  warehouseModelName,
  WarehousePersistence,
} from 'src/modules/warehouse/infras/repo/warehouse.dto';

export class PostgresInventoryRepository implements IInventoryRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async getInventoryByInventoryIdAndWarehouseId(
    inventory_id: string,
    warehouse_id: string,
    t?: Transaction
  ): Promise<InventoryWarehouse> {
    console.log(
      '🚀 ~ PostgresInventoryRepository ~ getInventoryByInventoryIdAndWarehouseId ~ warehouse_id:',
      warehouse_id,
      inventory_id
    );

    if (t) {
      const inventoryWarehouse = await this.sequelize.models[
        this.modelName
      ].findOne({
        where: { inventory_id, warehouse_id },
        transaction: t,
      });
      console.log(
        '🚀 ~ PostgresInventoryRepository ~ getInventoryByInventoryIdAndWarehouseId ~ inventoryWarehouse:',
        inventoryWarehouse?.dataValues
      );
      return inventoryWarehouse?.dataValues;
    }
    const inventoryWarehouse = await this.sequelize.models[
      this.modelName
    ].findOne({
      where: { inventory_id, warehouse_id },
    });
    console.log(
      '🚀 ~ PostgresInventoryRepository ~ getInventoryByInventoryIdAndWarehouseId ~ inventoryWarehouse:',
      inventoryWarehouse?.dataValues
    );
    return inventoryWarehouse?.dataValues;
  }

  async addInventoryWarehouse(
    data: InventoryWarehouseCreateDTO[],
    t?: Transaction
  ): Promise<InventoryWarehouse[]> {
    if (t) {
      const inventoryWarehouse = await this.sequelize.models[
        this.modelName
      ].bulkCreate(data, {
        transaction: t,
        returning: true,
      });
      return inventoryWarehouse.map((item) => item.dataValues);
    }
    const inventoryWarehouse = await this.sequelize.models[
      this.modelName
    ].bulkCreate(data, {
      returning: true,
    });
    return inventoryWarehouse.map((row) => row.dataValues);
  }
  async updateInventoryWarehouse(
    data: InventoryWarehouseUpdateDTO[],
    t?: Transaction
  ): Promise<InventoryWarehouse[]> {
    if (t) {
      const allUpdatedInventoryWarehouse = await Promise.all(
        data.map(async (item) => {
          const inventoryWarehouse = await this.sequelize.models[
            this.modelName
          ].update(item, {
            where: {
              inventory_id: item.inventory_id,
              warehouse_id: item.warehouse_id,
            },
            returning: true,
            transaction: t,
          });
          return inventoryWarehouse[1][0].dataValues;
        })
      );
      return allUpdatedInventoryWarehouse;
    }
    const allUpdatedInventoryWarehouse = await Promise.all(
      data.map(async (item) => {
        const inventoryWarehouse = await this.sequelize.models[
          this.modelName
        ].update(item, {
          returning: true,
          where: {
            inventory_id: item.inventory_id,
            warehouse_id: item.warehouse_id,
          },
        });
        return inventoryWarehouse[1][0].dataValues;
      })
    );
    return allUpdatedInventoryWarehouse;
  }
  async deleteInventoryWarehouse(
    inventory_id: string,
    warehouse_id: string,
    t?: Transaction
  ): Promise<boolean> {
    if (t) {
      await this.sequelize.models[this.modelName].destroy({
        where: { inventory_id, warehouse_id },
        transaction: t,
      });
      return true;
    }
    await this.sequelize.models[this.modelName].destroy({
      where: { inventory_id, warehouse_id },
    });
    return true;
  }

  async get(
    id: string,
    condition?: InventoryConditionDTO,
    t?: Transaction
  ): Promise<Inventory> {
    const include: Includeable[] = [];
    if (condition?.include_inventory_warehouse) {
      include.push({
        model: WarehousePersistence,
        as: warehouseModelName.toLowerCase(),
      });
    }
    const inventory = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
      transaction: t,
    });
    if (!inventory) {
      throw new Error('Inventory not found');
    }
    return inventory.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition: InventoryConditionDTO
  ): Promise<ListResponse<Inventory[]>> {
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const include: Includeable[] = [];
    if (condition?.include_product_sellable) {
      include.push({
        model: ProductSellablePersistence,
        as: productSellableModelName.toLowerCase(),
        include: [
          {
            model: VariantPersistence,
            as: variantModelName.toLowerCase(),
          },
        ],
      });
    }
    if (condition?.include_inventory_warehouse) {
      include.push({
        model: WarehousePersistence,
        as: warehouseModelName.toLowerCase(),
      });
    }
    if (condition.include_all) {
      const inventory = await this.sequelize.models[this.modelName].findAll({
        order: [[sortBy, order]],
        include,
      });
      return {
        data: inventory.map((row) => row.dataValues),
        meta: {
          limit,
          total_count: inventory.length,
          current_page: page,
          total_page: Math.ceil(inventory.length / limit),
        },
      };
    }
    const inventory = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
      include,
    });
    return {
      data: inventory.rows.map((row) => row.dataValues),
      meta: {
        limit,
        total_count: inventory.count,
        current_page: page,
        total_page: Math.ceil(inventory.count / limit),
      },
    };
  }
  async create(data: InventoryCreateDTO, t?: Transaction): Promise<Inventory> {
    if (t) {
      const inventory = await this.sequelize.models[this.modelName].create(
        data,
        {
          returning: true,
          transaction: t,
        }
      );
      return inventory.dataValues;
    }
    const inventory = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return inventory.dataValues;
  }
  async update(
    id: string,
    data: InventoryUpdateDTO,
    t?: Transaction
  ): Promise<Inventory> {
    if (t) {
      const inventory = await this.sequelize.models[this.modelName].update(
        data,
        {
          where: { id },
          returning: true,
          transaction: t,
        }
      );
      return inventory[1][0].dataValues;
    }
    const inventory = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return inventory[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    const inventory = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
