import { Includeable, Sequelize, Transaction } from 'sequelize';
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
  async getWarehouseById(
    id: string,
    condition?: WarehouseConditionDTO,
    t?: Transaction
  ): Promise<Warehouse> {
    if (t) {
      const warehouse = await this.sequelize.models[this.modelName].findByPk(
        id,
        { transaction: t }
      );
      return warehouse?.dataValues;
    }
    const warehouse = await this.sequelize.models[this.modelName].findByPk(id);
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
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      order: [[sortBy, order]],
      limit,
      offset: (page - 1) * limit,
      include,
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
