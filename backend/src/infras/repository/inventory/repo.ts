import {
  InventoryConditionDTO,
  InventoryCreateDTO,
  InventoryUpdateDTO,
} from '@models/inventory/inventory.dto';
import { IInventoryRepository } from '@models/inventory/inventory.interface';
import { Inventory } from '@models/inventory/inventory.model';
import { Sequelize } from 'sequelize';
import { BaseOrder, BaseSortBy, ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

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
    const inventory = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
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
  async create(data: InventoryCreateDTO): Promise<Inventory> {
    const inventory = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return inventory.dataValues;
  }
  async update(id: string, data: InventoryUpdateDTO): Promise<Inventory> {
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
