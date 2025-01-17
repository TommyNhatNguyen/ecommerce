import {
  VariantConditionDTO,
  VariantCreateDTO,
  VariantUpdateDTO,
} from 'src/modules/variant/models/variant.dto';
import { IVariantRepository } from 'src/modules/variant/models/variant.interface';
import { Variant } from 'src/modules/variant/models/variant.model';
import { Sequelize } from 'sequelize';
import {
  BaseSortBy,
  BaseOrder,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresVariantRepository implements IVariantRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(id: string, condition: VariantConditionDTO): Promise<Variant> {
    const variant = await this.sequelize.models[this.modelName].findByPk(id);
    return variant?.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition: VariantConditionDTO
  ): Promise<ListResponse<Variant[]>> {
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
      data: rows.map((row) => row.dataValues),
      meta: {
        limit,
        total_count: count,
        current_page: page,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async insert(data: VariantCreateDTO): Promise<Variant> {

    const result = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return result?.dataValues;
  }
  async update(id: string, data: VariantUpdateDTO): Promise<Variant> {
    const result = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return result[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}
