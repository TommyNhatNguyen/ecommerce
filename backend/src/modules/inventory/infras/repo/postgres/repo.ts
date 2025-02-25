import { Includeable, Sequelize } from 'sequelize';
import { IInventoryRepository } from 'src/modules/inventory/models/inventory.interface';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { Inventory } from 'src/modules/inventory/models/inventory.model';
import {
  InventoryConditionDTO,
  InventoryCreateDTO,
  InventoryUpdateDTO,
} from 'src/modules/inventory/models/inventory.dto';
import { Transaction } from 'sequelize';
import { productSellableModelName } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import { ProductSellablePersistence } from 'src/modules/product_sellable/infras/repo/postgres/dto';
import {
  variantModelName,
  VariantPersistence,
} from 'src/modules/variant/infras/repo/postgres/dto';

export class PostgresInventoryRepository implements IInventoryRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async get(id: string): Promise<Inventory> {
    const inventory = await this.sequelize.models[this.modelName].findByPk(id);
    return inventory?.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition: InventoryConditionDTO
  ): Promise<ListResponse<Inventory[]>> {
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const include: Includeable[] = [];
    if (condition.include_product_sellable) {
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
