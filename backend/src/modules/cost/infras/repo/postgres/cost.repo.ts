import { Sequelize } from 'sequelize';
import { Cost } from 'src/modules/cost/models/cost.model';
import {
  CostConditionDTO,
  CostCreateDTO,
  CostUpdateDTO,
} from 'src/modules/cost/models/cost.dto';
import { ICostRepository } from 'src/modules/cost/models/cost.interface';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { Op } from 'sequelize';
import { WhereOptions } from '@sequelize/core';

export class PostgresCostRepository implements ICostRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async getById(id: string, condition: CostConditionDTO): Promise<Cost> {
    const cost = await this.sequelize.models[this.modelName].findByPk(id);
    return cost?.dataValues || null;
  }
  async getList(
    paging: PagingDTO,
    condition: CostConditionDTO
  ): Promise<ListResponse<Cost[]>> {
    let where: WhereOptions = {};
    if (condition.ids) {
      where.id = {
        [Op.in]: condition.ids,
      };
    }
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: where,
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        current_page: page,
        limit,
        total_count: count,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async create(data: CostCreateDTO): Promise<Cost> {
    const cost = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return cost.dataValues;
  }
  async update(id: string, data: CostUpdateDTO): Promise<Cost> {
    const cost = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return cost[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
