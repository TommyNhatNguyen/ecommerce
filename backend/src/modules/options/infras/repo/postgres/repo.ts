import {
  OptionConditionDTO,
  OptionCreateDTO,
  OptionUpdateDTO,
  OptionValueConditionDTO,
  OptionValueCreateDTO,
  OptionValueUpdateDTO,
} from 'src/modules/options/models/option.dto';
import {
  IOptionRepository,
  IOptionValueRepository,
} from 'src/modules/options/models/option.interface';
import { Option, OptionValue } from 'src/modules/options/models/option.model';
import { Includeable, Sequelize } from 'sequelize';
import {
  BaseSortBy,
  BaseOrder,
  ListResponse,
} from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import { optionValueModelName, OptionValuePersistence } from 'src/modules/options/infras/repo/postgres/dto';

export class PostgresOptionRepository implements IOptionRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(id: string, condition: OptionConditionDTO): Promise<Option> {
    const option = await this.sequelize.models[this.modelName].findByPk(id);
    return option?.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition: OptionConditionDTO
  ): Promise<ListResponse<Option[]>> {
    const include: Includeable[] = [];
    if (condition.include_option_values) {
      include.push({
        model: OptionValuePersistence,
        as: optionValueModelName,
      });
    }
    const { page, limit } = paging;
    const order = condition?.order || BaseOrder.DESC;
    const sortBy = condition?.sortBy || BaseSortBy.CREATED_AT;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
      include,
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
  async insert(data: OptionCreateDTO): Promise<Option> {
    const result = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return result?.dataValues;
  }
  async update(id: string, data: OptionUpdateDTO): Promise<Option> {
    const result = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return result[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}

export class PostgresOptionValueRepository implements IOptionValueRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(
    id: string,
    condition?: OptionValueConditionDTO
  ): Promise<OptionValue> {
    const optionValue = await this.sequelize.models[this.modelName].findByPk(
      id
    );
    return optionValue?.dataValues;
  }
  async list(
    paging: PagingDTO,
    condition?: OptionValueConditionDTO
  ): Promise<ListResponse<OptionValue[]>> {
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
  async insert(data: OptionValueCreateDTO): Promise<OptionValue> {
    const result = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return result?.dataValues;
  }
  async update(id: string, data: OptionValueUpdateDTO): Promise<OptionValue> {
    const result = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return result[1][0].dataValues;
  }
  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
