import { Includeable, Sequelize, Transaction } from 'sequelize';
import { inventoryModelName } from 'src/modules/inventory/infras/repo/postgres/dto';
import { InventoryPersistence } from 'src/modules/inventory/infras/repo/postgres/dto';
import { ProductSellablePersistence } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { productSellableModelName } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { variantModelName, VariantPersistence } from 'src/modules/variant/infras/repo/postgres/dto';
import {
  WarehouseConditionDTO,
  WarehouseCreateDTO,
  WarehouseUpdateDTO,
} from 'src/modules/warehouse/models/warehouse.dto';
import { IWarehouseRepository } from 'src/modules/warehouse/models/warehouse.interface';
import { Warehouse } from 'src/modules/warehouse/models/warehouse.model';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresWarehouseRepository implements IWarehouseRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getAllWarehouse(
    condition?: WarehouseConditionDTO
  ): Promise<Warehouse[]> {
    const include: Includeable[] = [];
    const include_inventory: Includeable[] = [];
    if (condition?.include_product_sellable) {
      include_inventory.push({
        model: ProductSellablePersistence,
        as: productSellableModelName.toLowerCase(),
        include: [{
            model: VariantPersistence,
            as: variantModelName.toLowerCase(),
          },
        ],
      });
    }
    if (condition?.include_inventory) {
      include_inventory.push({
        model: InventoryPersistence,
        as: inventoryModelName.toLowerCase(),
        include: include_inventory,
      });
    }
    const warehouses = await this.sequelize.models[this.modelName].findAll({
      include,
    });
    return warehouses.map((warehouse) => warehouse.dataValues);
  }
  async getWarehouseById(
    id: string,
    condition?: WarehouseConditionDTO,
    t?: Transaction
  ): Promise<Warehouse> {
    const include: Includeable[] = [];
    const include_inventory: Includeable[] = [];
    if (condition?.include_product_sellable) {
      include_inventory.push({
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
    if (condition?.include_inventory) {
      include.push({
        model: InventoryPersistence,
        as: inventoryModelName.toLowerCase(),
        include: include_inventory,
      });
    }
    if (t) {
      const warehouse = await this.sequelize.models[this.modelName].findByPk(
        id,
        { transaction: t, include }
      );
      return warehouse?.dataValues;
    }
    const warehouse = await this.sequelize.models[this.modelName].findByPk(id, {
      include,
    });
    return warehouse?.dataValues;
  }
  async getWarehouseList(
    paging: PagingDTO,
    condition?: WarehouseConditionDTO
  ): Promise<ListResponse<Warehouse[]>> {
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const include: Includeable[] = [];
    const include_inventory: Includeable[] = [];
    if (condition?.include_product_sellable) {
      include_inventory.push({
        model: ProductSellablePersistence,
        as: productSellableModelName.toLowerCase(),
        include: [{
            model: VariantPersistence,
            as: variantModelName.toLowerCase(),
          },
        ],
      });
    }
    if (condition?.include_inventory) {
      include.push({
        model: InventoryPersistence,
        as: inventoryModelName.toLowerCase(),
        include: include_inventory,
      });
    }
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      order: [[sortBy, order]],
      limit,
      offset: (page - 1) * limit,
      include,
      distinct: true,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
        limit,
      },
    };
  }
  async createWarehouse(
    data: WarehouseCreateDTO,
    t?: Transaction
  ): Promise<Warehouse> {
    if (t) {
      const warehouse = await this.sequelize.models[this.modelName].create(
        data,
        { transaction: t, returning: true }
      );
      return warehouse.dataValues;
    }
    const warehouse = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return warehouse.dataValues;
  }
  async updateWarehouse(
    id: string,
    data: WarehouseUpdateDTO,
    t?: Transaction
  ): Promise<Warehouse> {
    if (t) {
      const warehouse = await this.sequelize.models[this.modelName].update(
        data,
        { where: { id }, transaction: t, returning: true }
      );
      return warehouse[1][0].dataValues;
    }
    const warehouse = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return warehouse[1][0].dataValues;
  }
  async deleteWarehouse(id: string, t?: Transaction): Promise<boolean> {
    if (t) {
      await this.sequelize.models[this.modelName].destroy({
        where: { id },
        transaction: t,
      });
      return true;
    }
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}
