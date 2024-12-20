import {
  DiscountConditionDTOSchema,
  DiscountCreateDTOSchema,
  DiscountUpdateDTOSchema,
} from '@models/discount/discount.dto';
import { IDiscountRepository } from '@models/discount/discount.interface';
import { Discount } from '@models/discount/discount.model';
import { Sequelize } from 'sequelize';
import {
  BaseOrder,
  BaseSortBy,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresDiscountRepository implements IDiscountRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async list(
    paging: PagingDTO,
    condition: DiscountConditionDTOSchema
  ): Promise<ListResponse<Discount[]>> {
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
    });
    return {
      data: rows as unknown as Discount[],
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
    if (discount) {
      return discount as unknown as Discount;
    }
    return null;
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
