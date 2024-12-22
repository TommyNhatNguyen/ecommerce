import {
  InventoryConditionDTO,
  InventoryCreateDTO,
  InventoryUpdateDTO,
} from '@models/inventory/inventory.dto';
import { InventoryRepository } from '@models/inventory/inventory.interface';
import { Inventory } from '@models/inventory/inventory.model';
import { Sequelize } from 'sequelize';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresInventoryRepository implements InventoryRepository {
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
    const inventory = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit,
      offset: (page - 1) * limit,
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
