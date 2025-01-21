import { Op, Sequelize } from 'sequelize';
import { PagingDTO } from 'src/share/models/paging';
import {
  DiscountConditionDTOSchema,
  DiscountCreateDTOSchema,
  DiscountUpdateDTOSchema,
} from 'src/modules/discount/models/discount.dto';
import { Discount } from 'src/modules/discount/models/discount.model';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { IDiscountRepository } from 'src/modules/discount/models/discount.interface';
import { WhereOptions } from '@sequelize/core';

export class PostgresDiscountRepository implements IDiscountRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async list(
    paging: PagingDTO,
    condition: DiscountConditionDTOSchema
  ): Promise<ListResponse<Discount[]>> {
    let where: WhereOptions = {};
    if (condition.ids && condition.ids.length > 0) {
      where.id = {
        [Op.in]: condition.ids,
      };
    }
    if (condition.scope) {
      where.scope = {
        [Op.eq]: condition.scope,
      };
    }
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      distinct: true,
      order: [[sortBy, order]],
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
  async get(id: string): Promise<Discount | null> {
    const discount = await this.sequelize.models[this.modelName].findByPk(id);
    return discount?.dataValues || null;
  }
  async insert(data: DiscountCreateDTOSchema): Promise<Discount> {
    const discount = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    const insertedDiscount = discount.dataValues;
    return insertedDiscount;
  }
  async update(id: string, data: DiscountUpdateDTOSchema): Promise<Discount> {
    const result = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    const updatedDiscount = result[1][0].dataValues;
    return updatedDiscount;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
